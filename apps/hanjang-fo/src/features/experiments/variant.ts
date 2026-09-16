import type { ExperimentVariant } from "./types";

export const hashVariant = (seed: string): ExperimentVariant => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % 2 === 0 ? "A" : "B";
};
