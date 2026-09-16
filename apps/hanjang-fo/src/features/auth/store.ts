import { create } from "zustand";

import type { AuthProvider, User } from "./types";

const SIGN_IN_LATENCY_MS = 400;

const mockUser = (provider: AuthProvider): User => ({
  userId: "user-1",
  name: "수험생",
  provider,
});

interface AuthState {
  user: User | null;
  signingIn: boolean;
  error: string | null;
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signingIn: false,
  error: null,
  signIn: async (provider) => {
    set({ signingIn: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, SIGN_IN_LATENCY_MS));
      set({ user: mockUser(provider), signingIn: false });
    } catch {
      set({
        signingIn: false,
        error: "로그인하지 못했어요 다시 시도할 수 있어요",
      });
    }
  },
  signOut: () => set({ user: null, error: null }),
}));
