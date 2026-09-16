import type { EXPERIMENTS } from "./constants";

export type ExperimentKey = (typeof EXPERIMENTS)[keyof typeof EXPERIMENTS];

export type ExperimentVariant = "A" | "B";

export type ExperimentEventKind = "exposure" | "conversion";
