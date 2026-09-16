import { useExperimentStore } from "./store";
import { hashVariant } from "./variant";

import { useQuizRunStore } from "@/features/quiz";
import { useSessionStore } from "@/features/session";

import type { ExperimentKey, ExperimentVariant } from "./types";

export const useExperiment = (key: ExperimentKey): ExperimentVariant => {
  const deviceId = useExperimentStore((state) => state.deviceId);
  return hashVariant(`${deviceId}:${key}`);
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
