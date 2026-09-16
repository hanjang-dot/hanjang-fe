import { useEffect } from "react";

import { trackExperimentEvent } from "./api";
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
