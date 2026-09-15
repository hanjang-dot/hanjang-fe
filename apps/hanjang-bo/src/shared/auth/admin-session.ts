import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminSession = {
  token: string | null;
  adminId: string | null;
  signIn: (adminId: string, token: string) => void;
  signOut: () => void;
};

export const useAdminSession = create<AdminSession>()(
  persist(
    (set) => ({
      token: null,
      adminId: null,
      signIn: (adminId, token) => set({ adminId, token }),
      signOut: () => set({ adminId: null, token: null }),
    }),
    { name: "hanjang-bo-admin" },
  ),
);
