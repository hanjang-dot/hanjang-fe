import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { variantFor } from "./assignment";
import { experimentStorage } from "./storage";

import type { ExperimentKey, ExperimentVariant } from "./types";

interface ExperimentsState {
  variants: Partial<Record<ExperimentKey, ExperimentVariant>>;
  exposures: ExperimentKey[];
  assign: (key: ExperimentKey) => ExperimentVariant;
  markExposed: (key: ExperimentKey) => boolean;
}

export const useExperimentStore = create<ExperimentsState>()(
  persist(
    (set, get) => ({
      variants: {},
      exposures: [],
      assign: (key) => {
        const existing = get().variants[key];
        if (existing) return existing;
        const variant = variantFor(key);
        set((state) => ({
          variants: { ...state.variants, [key]: variant },
        }));
        return variant;
      },
      markExposed: (key) => {
        if (get().exposures.includes(key)) return false;
        set((state) => ({ exposures: [...state.exposures, key] }));
        return true;
      },
    }),
    {
      name: "experiments",
      storage: createJSONStorage(() => experimentStorage),
      partialize: (state) => ({
        variants: state.variants,
        exposures: state.exposures,
      }),
    },
  ),
);
