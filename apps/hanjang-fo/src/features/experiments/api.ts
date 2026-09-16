import ky from "ky";

import { API_BASE_URL } from "@/shared/config";

import { useExperimentStore } from "./store";

import type {
  ExperimentEvent,
  ExperimentKey,
  ExperimentMeta,
} from "./types";

const http = API_BASE_URL ? ky.create({ prefix: API_BASE_URL }) : null;

export const trackExperimentEvent = (
  key: ExperimentKey,
  event: ExperimentEvent,
  meta?: ExperimentMeta,
) => {
  if (!http) return;
  const variant =
    useExperimentStore.getState().variants[key] === "B"
      ? "variant"
      : "control";
  void http
    .post("experiments/events", {
      json: { key, variant, event, meta },
      timeout: 5000,
    })
    .catch(() => undefined);
};
