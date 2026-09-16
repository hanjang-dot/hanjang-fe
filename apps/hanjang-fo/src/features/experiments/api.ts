import ky from "ky";

import { assignVariant } from "./assign-variant";
import { useExperimentsStore } from "./store";

import { API_BASE_URL } from "@/shared/config";

import type { ExperimentEventKind, ExperimentKey } from "./types";

export const trackExperimentEvent = (
  key: ExperimentKey,
  event: ExperimentEventKind,
  meta?: Record<string, unknown>,
) => {
  if (!API_BASE_URL) return;
  const { deviceId } = useExperimentsStore.getState();
  void ky
    .post("experiments/events", {
      prefix: API_BASE_URL,
      json: {
        experiment: key,
        variant: assignVariant(`${deviceId}:${key}`),
        event,
        deviceId,
        meta,
      },
    })
    .catch(() => {});
};
