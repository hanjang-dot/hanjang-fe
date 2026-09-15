import { useMutation } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

export const useAcceptAdminInvite = () =>
  useMutation({
    mutationFn: ({ token, ...json }: { token: string; id: string; password: string }) =>
      request((signal) =>
        api.post(`admin/invites/${token}/accept`, { json, signal }).json<{ id: string }>(),
      ),
  });
