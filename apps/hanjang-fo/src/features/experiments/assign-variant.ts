import type { ExperimentKey, ExperimentVariant } from "./types";

export const assignVariant = (
  deviceId: string,
  key: ExperimentKey,
): ExperimentVariant => {
  const input = `${key}:${deviceId}`;
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0) % 2 === 0 ? "A" : "B";
};
