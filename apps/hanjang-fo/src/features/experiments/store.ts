import Constants from "expo-constants";
import { Storage } from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { EXPERIMENT_STORAGE_NAME } from "./constants";

interface ExperimentsState {
  deviceId: string;
}

const createDeviceId = () =>
  Constants.deviceId ??
  `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export const useExperimentStore = create<ExperimentsState>()(
  persist(() => ({ deviceId: createDeviceId() }), {
    name: EXPERIMENT_STORAGE_NAME,
    storage: createJSONStorage(() => Storage),
  }),
);
