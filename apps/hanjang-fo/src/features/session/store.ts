import { Effect } from "effect";
import { create } from "zustand";

import { sessionClient } from "./api";
import { SESSION_SCHEMA_VERSION } from "./constants";
import { saveSession } from "./db";

import type { ExamSession, GradeResult, Stroke } from "./types";

interface SessionState {
  hydrated: boolean;
  sessions: Record<string, ExamSession>;
  grades: Record<string, Record<string, GradeResult>>;
  hydrate: (sessions: ExamSession[]) => void;
  startSession: (examId: string, timeLimitSec: number) => ExamSession;
  setAnswer: (sessionId: string, questionId: string, choiceId: string) => void;
  addStroke: (sessionId: string, stroke: Stroke) => void;
  setGrade: (sessionId: string, result: GradeResult) => void;
  submitSession: (sessionId: string) => void;
}

let sessionSeq = 0;

const persist = (session: ExamSession | undefined) => {
  if (!session) return;
  try {
    saveSession(session);
  } catch (error) {
    console.warn("session persist failed", error);
  }
  if (sessionClient) {
    void Effect.runPromise(sessionClient.saveDraft(session)).catch(
      (error: unknown) => {
        console.warn("session backup failed", error);
      },
    );
  }
};

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
    return session;
  },
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
  addStroke: (sessionId, stroke) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const next = { ...session, inkDraft: [...session.inkDraft, stroke] };
      persist(next);
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
  submitSession: (sessionId) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const next = { ...session, status: "graded" as const };
      persist(next);
      return { sessions: { ...state.sessions, [sessionId]: next } };
    }),
}));
