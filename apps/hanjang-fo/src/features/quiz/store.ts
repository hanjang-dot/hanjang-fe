import { create } from "zustand";

import type { Quiz, QuizAnswer } from "./types";

interface QuizRunState {
  index: number;
  answers: Record<string, QuizAnswer>;
  select: (quiz: Quiz, choiceIndex: number) => void;
  next: () => void;
  reset: () => void;
}

export const useQuizRunStore = create<QuizRunState>((set) => ({
  index: 0,
  answers: {},
  select: (quiz, choiceIndex) =>
    set((state) => {
      if (state.answers[quiz.quizId]) return state;
      return {
        answers: {
          ...state.answers,
          [quiz.quizId]: {
            quizId: quiz.quizId,
            choiceIndex,
            correct: choiceIndex === quiz.answerIndex,
          },
        },
      };
    }),
  next: () => set((state) => ({ index: state.index + 1 })),
  reset: () => set({ index: 0, answers: {} }),
}));

export const useQuizResults = (quizzes: Quiz[]): QuizAnswer[] => {
  const answers = useQuizRunStore((state) => state.answers);
  return quizzes
    .map((quiz) => answers[quiz.quizId])
    .filter((answer): answer is QuizAnswer => answer !== undefined);
};
