import ky from "ky";

import { API_BASE_URL } from "@/shared/config";

import { assignVariant } from "./assign-variant";
import { useExperimentStore } from "./store";

import type {
  ExperimentEventMeta,
  ExperimentEventName,
  ExperimentKey,
} from "./types";

export const trackExperimentEvent = (
  key: ExperimentKey,
  event: ExperimentEventName,
  meta?: ExperimentEventMeta,
) => {
  if (!API_BASE_URL) return;
  const deviceId = useExperimentStore.getState().deviceId;
  const http = ky.create({ prefix: API_BASE_URL });
  void http
    .post("experiments/events", {
      json: {
        key,
        event,
        variant: assignVariant(deviceId, key),
        deviceId,
        meta,
      },
    })
    .catch(() => undefined);
};
