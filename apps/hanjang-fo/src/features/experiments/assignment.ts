import Constants from "expo-constants";

import type { ExperimentKey, ExperimentVariant } from "./types";

const hash = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const deviceSeed = () => {
  const constants = Constants as {
    deviceId?: string;
    installationId?: string;
    sessionId?: string;
  };
  return (
    constants.deviceId ??
    constants.installationId ??
    constants.sessionId ??
    "hanjang-device"
  );
};

export const variantFor = (key: ExperimentKey): ExperimentVariant =>
  hash(`${deviceSeed()}:${key}`) % 2 === 0 ? "A" : "B";
