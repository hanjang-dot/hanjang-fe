import { useEffect } from "react";

import { trackExperimentEvent } from "./api";
import { assignVariant } from "./assign-variant";
import { useExperimentsStore } from "./store";

import type { ExperimentKey, ExperimentVariant } from "./types";

export const useExperiment = (key: ExperimentKey): ExperimentVariant => {
  const deviceId = useExperimentsStore((state) => state.deviceId);
  return assignVariant(`${deviceId}:${key}`);
};

export const useExperimentExposure = (
  key: ExperimentKey,
): ExperimentVariant => {
  const variant = useExperiment(key);
  useEffect(() => {
    trackExperimentEvent(key, "exposure", { variant });
  }, [key, variant]);
  return variant;
};
