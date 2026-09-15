import { create } from "zustand";

import type { User } from "./types";

const MOCK_USER: User = {
  userId: "user-1",
  name: "수험생",
  provider: "kakao",
};

interface AuthState {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USER,
  signIn: () => set({ user: MOCK_USER }),
  signOut: () => set({ user: null }),
}));
