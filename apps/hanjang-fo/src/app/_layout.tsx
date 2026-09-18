import "@/theme";

import { useEffect } from "react";
import * as Linking from "expo-linking";
import { Stack, router } from "expo-router";

import { useAuthStore } from "@/features/auth";
import { AppProviders } from "@/providers";

const AuthDeepLink = () => {
  const signInWithTokens = useAuthStore((state) => state.signInWithTokens);

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      if (!url.startsWith("hanjang://auth/kakao")) return;
      const { queryParams } = Linking.parse(url);
      const access = queryParams?.access;
      const refresh = queryParams?.refresh;
      if (typeof access !== "string" || typeof refresh !== "string") return;
      if (!access.length || !refresh.length) return;
      signInWithTokens({ accessToken: access, refreshToken: refresh });
      router.replace("/");
    });
    return () => sub.remove();
  }, [signInWithTokens]);

  return null;
};

const RootLayout = () => (
  <AppProviders>
    <AuthDeepLink />
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="auth/kakao" />
      <Stack.Screen name="exam/[exam-id]" />
      <Stack.Screen name="exam-result/[session-id]" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="quiz-result" />
      <Stack.Screen name="debug" />
    </Stack>
  </AppProviders>
);

export default RootLayout;
