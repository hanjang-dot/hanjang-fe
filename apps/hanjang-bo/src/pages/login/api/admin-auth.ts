import { useMutation } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";
import { useAdminSession } from "@/shared/auth/admin-session";

type AdminLoginResponse = {
  token: string;
  admin: { id: string };
};

export const useAdminLogin = () => {
  const signIn = useAdminSession((state) => state.signIn);
  return useMutation({
    mutationFn: (variables: { id: string; password: string }) =>
      request((signal) =>
        api.post("admin/login", { json: variables, signal }).json<AdminLoginResponse>(),
      ),
    onSuccess: (data, variables) => signIn(variables.id, data.token),
  });
};
