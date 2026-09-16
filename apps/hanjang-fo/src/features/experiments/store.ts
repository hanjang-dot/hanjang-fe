import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { EXPERIMENTS_STORAGE_KEY } from "./constants";
import { experimentStorage } from "./storage";

interface ExperimentsState {
  deviceId: string;
}

const createDeviceId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export const useExperimentsStore = create<ExperimentsState>()(
  persist(() => ({ deviceId: createDeviceId() }), {
    name: EXPERIMENTS_STORAGE_KEY,
    storage: createJSONStorage(() => experimentStorage),
  }),
);
