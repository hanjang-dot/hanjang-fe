import { Effect } from "effect";
import { create } from "zustand";

import { hanjangApi } from "@/shared/api-client";

import type { Quiz, QuizAnswer } from "./types";

interface QuizRunState {
  index: number;
  quizSessionId: string | null;
  answers: Record<string, QuizAnswer>;
  begin: (quizIds: string[]) => void;
  select: (quiz: Quiz, choiceIndex: number) => void;
  submit: () => void;
  next: () => void;
  reset: () => void;
}

export const useQuizRunStore = create<QuizRunState>((set, get) => ({
  index: 0,
  quizSessionId: null,
  answers: {},
  begin: (quizIds) => {
    set({ index: 0, answers: {}, quizSessionId: null });
    if (!hanjangApi || quizIds.length === 0) return;
    void Effect.runPromise(hanjangApi.quizSessions.start({ quizIds }))
      .then((session) => set({ quizSessionId: session.quizSessionId }))
      .catch((error: unknown) => {
        console.warn("quiz session start failed", error);
      });
  },
  select: (quiz, choiceIndex) => {
    const state = get();
    if (state.answers[quiz.quizId]) return;
    const known = quiz.answerIndex !== undefined;
    set({
      answers: {
        ...state.answers,
        [quiz.quizId]: {
          quizId: quiz.quizId,
          choiceIndex,
          correct: known ? choiceIndex === quiz.answerIndex : null,
        },
      },
    });
    const quizSessionId = state.quizSessionId;
    if (known || !hanjangApi || !quizSessionId) return;
    const choice = quiz.choices[choiceIndex];
    void Effect.runPromise(
      hanjangApi.grade.quiz({ quizSessionId, quizId: quiz.quizId, choice }),
    )
      .then((result) =>
        set((current) => {
          const answer = current.answers[quiz.quizId];
          if (!answer || answer.choiceIndex !== choiceIndex) return current;
          return {
            answers: {
              ...current.answers,
              [quiz.quizId]: { ...answer, correct: result.correct },
            },
          };
        }),
      )
      .catch((error: unknown) => {
        console.warn("quiz grade failed", error);
      });
  },
  submit: () => {
    const quizSessionId = get().quizSessionId;
    if (!hanjangApi || !quizSessionId) return;
    void Effect.runPromise(
      hanjangApi.quizSessions.submit(quizSessionId),
    ).catch((error: unknown) => {
      console.warn("quiz session submit failed", error);
    });
  },
  next: () => set((state) => ({ index: state.index + 1 })),
  reset: () => set({ index: 0, answers: {}, quizSessionId: null }),
}));

export const useQuizResults = (quizzes: Quiz[]): QuizAnswer[] => {
  const answers = useQuizRunStore((state) => state.answers);
  return quizzes
    .map((quiz) => answers[quiz.quizId])
    .filter((answer): answer is QuizAnswer => answer !== undefined);
};
