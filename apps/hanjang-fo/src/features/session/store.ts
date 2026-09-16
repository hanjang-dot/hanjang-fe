import { Effect } from "effect";
import { create } from "zustand";

import { sessionClient } from "./api";
import { SESSION_SCHEMA_VERSION } from "./constants";
import { saveSession } from "./db";

import type { RemoteSessionDetail } from "./session-client";
import type { ExamSession, GradeResult, Stroke } from "./types";

interface SessionState {
  hydrated: boolean;
  sessions: Record<string, ExamSession>;
  grades: Record<string, Record<string, GradeResult>>;
  hydrate: (sessions: ExamSession[]) => void;
  mergeRemote: (
    items: { session: ExamSession; grades: Record<string, GradeResult> }[],
  ) => void;
  startSession: (examId: string, timeLimitSec: number) => ExamSession;
  attachRemote: (
    sessionId: string,
    remoteId: string,
    deadlineAt: number,
  ) => void;
  setAnswer: (sessionId: string, questionId: string, choiceId: string) => void;
  addStroke: (
    sessionId: string,
    stroke: Stroke,
    questionId?: string,
  ) => void;
  setGrade: (sessionId: string, result: GradeResult) => void;
  submitSession: (sessionId: string) => Promise<void>;
}

let sessionSeq = 0;

const persist = (session: ExamSession | undefined) => {
  if (!session) return;
  try {
    saveSession(session);
  } catch (error) {
    console.warn("session persist failed", error);
  }
};

const syncStroke = (
  session: ExamSession,
  questionId: string | undefined,
  stroke: Stroke,
) => {
  if (!sessionClient || !session.remoteId || !questionId) return;
  void Effect.runPromise(
    sessionClient.saveStroke(session.remoteId, questionId, stroke.points),
  ).catch((error: unknown) => {
    console.warn("stroke sync failed", error);
  });
};

const syncSubmit = async (session: ExamSession) => {
  if (!sessionClient || !session.remoteId) return;
  await Effect.runPromise(sessionClient.submit(session.remoteId)).catch(
    (error: unknown) => {
      console.warn("session submit sync failed", error);
    },
  );
};

const toLocalSession = (detail: RemoteSessionDetail): ExamSession => ({
  sessionId: `remote-${detail.remoteId}`,
  remoteId: detail.remoteId,
  examId: detail.examId,
  deadlineAt: detail.deadlineAt,
  answers: detail.answers,
  inkDraft: detail.inkDraft,
  schemaVersion: SESSION_SCHEMA_VERSION,
  status:
    detail.status === "graded" || detail.status === "aborted"
      ? detail.status
      : detail.answers && Object.keys(detail.answers).length > 0
        ? "restoring"
        : "idle",
});

export const remoteDetailToLocal = toLocalSession;

export const useSessionStore = create<SessionState>((set, get) => ({
  hydrated: false,
  sessions: {},
  grades: {},
  hydrate: (sessions) =>
    set({
      hydrated: true,
      sessions: Object.fromEntries(
        sessions.map((session) => [session.sessionId, session]),
      ),
    }),
  mergeRemote: (items) =>
    set((state) => {
      const sessions = { ...state.sessions };
      const grades = { ...state.grades };
      for (const { session: remote, grades: remoteGrades } of items) {
        const existing = Object.values(sessions).find(
          (session) =>
            session.remoteId === remote.remoteId ||
            session.sessionId === remote.sessionId ||
            (!session.remoteId &&
              session.examId === remote.examId &&
              (session.status === "idle" || session.status === "restoring")),
        );
        if (existing) {
          delete sessions[existing.sessionId];
          const merged: ExamSession =
            remote.status === "graded" || remote.status === "aborted"
              ? remote
              : {
                  ...remote,
                  answers: { ...remote.answers, ...existing.answers },
                  inkDraft: [...remote.inkDraft, ...existing.inkDraft],
                };
          sessions[merged.sessionId] = merged;
          persist(merged);
        } else {
          sessions[remote.sessionId] = remote;
          persist(remote);
        }
        if (Object.keys(remoteGrades).length > 0) {
          grades[remote.sessionId] = {
            ...grades[remote.sessionId],
            ...remoteGrades,
          };
        }
      }
      return { sessions, grades };
    }),
  startSession: (examId, timeLimitSec) => {
    const existing = Object.values(get().sessions).find(
      (session) =>
        session.examId === examId &&
        (session.status === "idle" || session.status === "restoring"),
    );
    if (existing) return existing;
    sessionSeq += 1;
    const session: ExamSession = {
      sessionId: `session-${Date.now()}-${sessionSeq}`,
      examId,
      deadlineAt: Date.now() + timeLimitSec * 1000,
      answers: {},
      inkDraft: [],
      schemaVersion: SESSION_SCHEMA_VERSION,
      status: "idle",
    };
    set((state) => ({
      sessions: { ...state.sessions, [session.sessionId]: session },
    }));
    persist(session);
    if (sessionClient) {
      void Effect.runPromise(sessionClient.createSession(examId))
        .then((remote) => {
          get().attachRemote(session.sessionId, remote.remoteId, remote.deadlineAt);
        })
        .catch((error: unknown) => {
          console.warn("remote session create failed", error);
        });
    }
    return session;
  },
  attachRemote: (sessionId, remoteId, deadlineAt) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const next = { ...session, remoteId, deadlineAt };
      persist(next);
      return { sessions: { ...state.sessions, [sessionId]: next } };
    }),
  setAnswer: (sessionId, questionId, choiceId) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const next = {
        ...session,
        answers: { ...session.answers, [questionId]: choiceId },
      };
      persist(next);
      return { sessions: { ...state.sessions, [sessionId]: next } };
    }),
  addStroke: (sessionId, stroke, questionId) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const next = { ...session, inkDraft: [...session.inkDraft, stroke] };
      persist(next);
      syncStroke(session, questionId, stroke);
      return { sessions: { ...state.sessions, [sessionId]: next } };
    }),
  setGrade: (sessionId, result) =>
    set((state) => ({
      grades: {
        ...state.grades,
        [sessionId]: {
          ...state.grades[sessionId],
          [result.questionId]: result,
        },
      },
    })),
  submitSession: async (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) return;
    await syncSubmit(session);
    set((state) => {
      const current = state.sessions[sessionId];
      if (!current) return state;
      const next = { ...current, status: "graded" as const };
      persist(next);
      return { sessions: { ...state.sessions, [sessionId]: next } };
    });
  },
}));
