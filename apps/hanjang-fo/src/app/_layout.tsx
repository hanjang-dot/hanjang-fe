import "@/theme";

import { Stack } from "expo-router";

import { AppProviders } from "@/providers";

const RootLayout = () => (
  <AppProviders>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="exam/[exam-id]" />
      <Stack.Screen name="result/[session-id]" />
    </Stack>
  </AppProviders>
);

export default RootLayout;
