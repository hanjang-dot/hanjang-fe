import { useCallback, useEffect, useRef, useState } from "react";
import { Cause, Exit } from "effect";

import { gradeClient as defaultGradeClient } from "./api";
import { initSessionTable, loadSessions } from "./db";
import { createGradeGate } from "./grade-run";
import { useSessionStore } from "./store";

import type { GradeGate } from "./grade-run";
import type {
  ExamSession,
  GradeClient,
  GradeVariant,
} from "./types";
import type { Question } from "@/features/exam";

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
  }, [hydrate]);
};

export const useExamSession = (
  examId: string,
  timeLimitSec?: number,
): ExamSession | null => {
  const hydrated = useSessionStore((state) => state.hydrated);
  const session = useSessionStore((state) =>
    Object.values(state.sessions).find(
      (item) => item.examId === examId && item.status !== "graded",
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
      Object.values(state.sessions).find(
        (session) => session.status !== "graded",
      ) ?? null,
  );

export const useSession = (sessionId: string): ExamSession | null =>
  useSessionStore((state) => state.sessions[sessionId] ?? null);

export const useGradedSessions = (): ExamSession[] =>
  useSessionStore((state) =>
    Object.values(state.sessions).filter(
      (session) => session.status === "graded",
    ),
  );

export const useSessionGrades = (sessionId: string) =>
  useSessionStore((state) => state.grades[sessionId] ?? {});

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
      if (!hydrated || session.status === "restoring") return;
      if (variant === "grading") return;
      const runId = gate.nextRunId();
      const run = gate.start(
        runId,
        client.grade({
          runId,
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
