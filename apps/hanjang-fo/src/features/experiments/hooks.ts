import { useEffect } from "react";

import { trackExperimentEvent } from "./api";

import { useQuizRunStore } from "@/features/quiz";
import { useSessionStore } from "@/features/session";
import { useExperimentStore } from "./store";

import type { ExperimentKey, ExperimentVariant } from "./types";

export const useExperiment = (key: ExperimentKey): ExperimentVariant => {
  const variant =
    useExperimentStore((state) => state.variants[key]) ??
    useExperimentStore.getState().assign(key);
  useEffect(() => {
    if (useExperimentStore.getState().markExposed(key)) {
      trackExperimentEvent(key, "exposure");
    }
  }, [key]);
  return variant;
};

export const useWrongAnswerCount = () => {
  const sessionWrong = useSessionStore((state) =>
    Object.values(state.grades).reduce(
      (total, results) =>
        total +
        Object.values(results).filter((result) => !result.correct).length,
      0,
    ),
  );
  const quizWrong = useQuizRunStore(
    (state) =>
      Object.values(state.answers).filter((answer) => !answer.correct).length,
  );
  return sessionWrong + quizWrong;
};
