import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/features/auth";

const KakaoRedirect = () => {
  const router = useRouter();
  const { access, refresh } = useLocalSearchParams<{
    access?: string;
    refresh?: string;
  }>();
  const signInWithTokens = useAuthStore((state) => state.signInWithTokens);

  useEffect(() => {
    if (access && refresh) {
      signInWithTokens({ accessToken: access, refreshToken: refresh });
      router.replace("/");
      return;
    }
    router.replace("/login");
  }, [access, refresh, router, signInWithTokens]);

  return null;
};

export default KakaoRedirect;
