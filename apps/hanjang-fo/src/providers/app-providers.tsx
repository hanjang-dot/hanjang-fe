import {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
} from "@expo-google-fonts/ibm-plex-sans-kr";
import {
  NotoSerifKR_600SemiBold,
  NotoSerifKR_700Bold,
} from "@expo-google-fonts/noto-serif-kr";
import { useFonts } from "expo-font";
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

const AppProviders = ({ children }: PropsWithChildren) => {
  const [fontsLoaded] = useFonts({
    IBMPlexSansKR_400Regular,
    IBMPlexSansKR_500Medium,
    IBMPlexSansKR_600SemiBold,
    NotoSerifKR_600SemiBold,
    NotoSerifKR_700Bold,
  });
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <SessionGate>{fontsLoaded ? children : null}</SessionGate>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default AppProviders;
