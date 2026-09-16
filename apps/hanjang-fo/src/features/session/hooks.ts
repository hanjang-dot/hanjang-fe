import { useCallback, useEffect, useRef, useState } from "react";
import { Cause, Effect, Exit } from "effect";
import { useShallow } from "zustand/react/shallow";

import { gradeClient as defaultGradeClient, sessionClient } from "./api";
import { initSessionTable, loadSessions } from "./db";
import { createGradeGate } from "./grade-run";
import { remoteDetailToLocal, useSessionStore } from "./store";

import type { GradeGate } from "./grade-run";
import type { ExamSession, GradeClient, GradeVariant } from "./types";
import type { Question } from "@/features/exam";

const syncRemoteSessions = async () => {
  const client = sessionClient;
  if (!client) return;
  try {
    const list = await Effect.runPromise(client.listSessions());
    const items = (
      await Promise.all(
        list.map((remote) =>
          Effect.runPromise(client.detail(remote.remoteId)).catch(
            () => null,
          ),
        ),
      )
    )
      .filter((detail) => detail !== null)
      .map((detail) => ({
        session: remoteDetailToLocal(detail),
        grades: detail.grades,
      }));
    useSessionStore.getState().mergeRemote(items);

    const pending = Object.values(useSessionStore.getState().sessions).filter(
      (session) => !session.remoteId && session.status !== "graded",
    );
    for (const session of pending) {
      try {
        const remote = await Effect.runPromise(
          client.createSession(session.examId),
        );
        useSessionStore
          .getState()
          .attachRemote(session.sessionId, remote.remoteId, remote.deadlineAt);
        await Promise.all(
          Object.entries(session.answers).map(([questionId, choice]) =>
            Effect.runPromise(
              client.saveAnswer(remote.remoteId, questionId, choice),
            ).catch(() => undefined),
          ),
        );
      } catch (error) {
        console.warn("session push failed", error);
      }
    }
  } catch (error) {
    console.warn("session remote sync failed", error);
  }
};

export const useHydrateSessions = () => {
  const hydrate = useSessionStore((state) => state.hydrate);
  useEffect(() => {
    try {
      initSessionTable();
      hydrate(loadSessions());
    } catch (error) {
      console.warn("session restore failed", error);
      hydrate([]);
    }
    void syncRemoteSessions();
  }, [hydrate]);
};

const isLive = (session: ExamSession) =>
  session.status === "idle" || session.status === "restoring";

export const useExamSession = (
  examId: string,
  timeLimitSec?: number,
): ExamSession | null => {
  const hydrated = useSessionStore((state) => state.hydrated);
  const session = useSessionStore((state) =>
    Object.values(state.sessions).find(
      (item) => item.examId === examId && isLive(item),
    ),
  );
  const startSession = useSessionStore((state) => state.startSession);
  useEffect(() => {
    if (hydrated && !session && timeLimitSec !== undefined) {
      startSession(examId, timeLimitSec);
    }
  }, [hydrated, session, examId, timeLimitSec, startSession]);
  if (!hydrated) return null;
  return session ?? null;
};

export const useActiveSession = (): ExamSession | null =>
  useSessionStore(
    (state) =>
      Object.values(state.sessions).find(isLive) ?? null,
  );

export const useSession = (sessionId: string): ExamSession | null =>
  useSessionStore((state) => state.sessions[sessionId] ?? null);

export const useGradedSessions = (): ExamSession[] =>
  useSessionStore(
    useShallow((state) =>
      Object.values(state.sessions).filter(
        (session) => session.status === "graded",
      ),
    ),
  );

const EMPTY_GRADES = {};

export const useSessionGrades = (sessionId: string) =>
  useSessionStore((state) => state.grades[sessionId] ?? EMPTY_GRADES);

export const useGradeChoice = (
  session: ExamSession,
  question: Question,
  client: GradeClient = defaultGradeClient,
) => {
  const [variant, setVariant] = useState<GradeVariant>("idle");
  const gateRef = useRef<GradeGate | null>(null);
  gateRef.current ??= createGradeGate();
  const gate = gateRef.current;
  const hydrated = useSessionStore((state) => state.hydrated);
  const grade = useSessionStore(
    (state) => state.grades[session.sessionId]?.[question.questionId] ?? null,
  );
  const setAnswer = useSessionStore((state) => state.setAnswer);
  const setGrade = useSessionStore((state) => state.setGrade);

  const choose = useCallback(
    (choiceId: string) => {
      if (!hydrated) return;
      if (variant === "grading") return;
      if (!session.remoteId) {
        setAnswer(session.sessionId, question.questionId, choiceId);
        setVariant("graded");
        return;
      }
      const runId = gate.nextRunId();
      const run = gate.start(
        runId,
        client.grade({
          runId,
          examSessionId: session.remoteId,
          questionId: question.questionId,
          choiceId,
          correctChoiceId: question.correctChoiceId,
        }),
      );
      setVariant("grading");
      run.fiber.addObserver((exit) => {
        if (!gate.isCurrent(run)) return;
        if (Exit.isSuccess(exit)) {
          const result = exit.value;
          if (result.runId !== run.runId) return;
          setAnswer(session.sessionId, question.questionId, choiceId);
          setGrade(session.sessionId, result);
          setVariant("graded");
          return;
        }
        setVariant(
          Cause.isInterruptedOnly(exit.cause) ? "aborted" : "error",
        );
      });
    },
    [hydrated, session, question, variant, gate, client, setAnswer, setGrade],
  );

  return { variant, grade, choose };
};
