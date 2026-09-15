import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet } from "react-native-unistyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useHydrateSessions } from "@/features/session";

import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const SessionGate = ({ children }: PropsWithChildren) => {
  useHydrateSessions();
  return children;
};

const AppProviders = ({ children }: PropsWithChildren) => (
  <GestureHandlerRootView style={styles.root}>
    <QueryClientProvider client={queryClient}>
      <SessionGate>{children}</SessionGate>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default AppProviders;
