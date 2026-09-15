import { useMutation } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

export type AdminInvite = {
  token: string;
  expiresAt: string;
};

export const useCreateAdminInvite = () =>
  useMutation({
    mutationFn: () =>
      request((signal) => api.post("admin/invites", { signal }).json<AdminInvite>()),
  });
