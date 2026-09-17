import "@/theme";

import { Stack } from "expo-router";

import { AppProviders } from "@/providers";

const RootLayout = () => (
  <AppProviders>
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
