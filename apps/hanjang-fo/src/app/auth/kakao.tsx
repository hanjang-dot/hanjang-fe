import { useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useAuthStore } from "@/features/auth";

const KakaoAuthRoute = () => {
  const { access, refresh } = useLocalSearchParams<{
    access?: string;
    refresh?: string;
  }>();
  const signInWithTokens = useAuthStore((state) => state.signInWithTokens);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    if (access?.length && refresh?.length) {
      called.current = true;
      signInWithTokens({ accessToken: access, refreshToken: refresh });
      router.replace("/");
      return;
    }
    const timer = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        router.replace("/");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [access, refresh, signInWithTokens]);

  return null;
};

export default KakaoAuthRoute;