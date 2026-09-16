import { useMutation } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

export const useAcceptAdminInvite = () =>
  useMutation({
    mutationFn: (variables: { token: string; loginId: string; password: string }) =>
      request((signal) =>
        api
          .post("admin/invites/accept", { json: variables, signal })
          .json<{ accessToken: string }>(),
      ),
  });
