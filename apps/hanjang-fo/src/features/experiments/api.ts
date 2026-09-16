import ky from "ky";

import { useExperimentStore } from "./store";
import { hashVariant } from "./variant";

import { API_BASE_URL } from "@/shared/config";

import type { ExperimentEventName, ExperimentKey } from "./types";

export const trackExperimentEvent = (
  key: ExperimentKey,
  event: ExperimentEventName,
  meta?: Record<string, unknown>,
) => {
  if (!API_BASE_URL) return;
  const deviceId = useExperimentStore.getState().deviceId;
  const variant = hashVariant(`${deviceId}:${key}`);
  const http = ky.create({ prefix: API_BASE_URL });
  void http
    .post("experiments/events", {
      json: { experiment: key, event, variant, deviceId, ...meta },
    })
    .then(() => undefined)
    .catch(() => undefined);
};
