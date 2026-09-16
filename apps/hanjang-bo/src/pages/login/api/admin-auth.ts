import { useMutation } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";
import { useAdminSession } from "@/shared/auth/admin-session";

type AdminLoginResponse = {
  accessToken: string;
};

export const useAdminLogin = () => {
  const signIn = useAdminSession((state) => state.signIn);
  return useMutation({
    mutationFn: (variables: { loginId: string; password: string }) =>
      request((signal) =>
        api.post("admin/login", { json: variables, signal }).json<AdminLoginResponse>(),
      ),
    onSuccess: (data, variables) => signIn(variables.loginId, data.accessToken),
  });
};
