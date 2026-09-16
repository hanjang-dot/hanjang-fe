import { assignVariant } from "./assign-variant";
import { useExperimentStore } from "./store";

import type { ExperimentKey, ExperimentVariant } from "./types";

export const useExperiment = (key: ExperimentKey): ExperimentVariant => {
  const deviceId = useExperimentStore((state) => state.deviceId);
  return assignVariant(deviceId, key);
};
