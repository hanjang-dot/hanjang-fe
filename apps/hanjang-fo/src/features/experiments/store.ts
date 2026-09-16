import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const createDeviceId = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

interface ExperimentState {
  deviceId: string;
}

export const useExperimentStore = create<ExperimentState>()(
  persist(() => ({ deviceId: createDeviceId() }), {
    name: "experiments",
    storage: createJSONStorage(() => ({
      getItem: (name) => Storage.getItemSync(name),
      setItem: (name, value) => {
        Storage.setItemSync(name, value);
      },
      removeItem: (name) => {
        Storage.removeItemSync(name);
      },
    })),
  }),
);
