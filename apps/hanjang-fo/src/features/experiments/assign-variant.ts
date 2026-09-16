import type { ExperimentVariant } from "./types";

export const assignVariant = (deviceId: string): ExperimentVariant => {
  let hash = 5381;
  for (const char of deviceId) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }
  return (hash >>> 0) % 2 === 0 ? "A" : "B";
};
