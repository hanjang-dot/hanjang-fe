import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { RESTORE_DELAY_STORAGE_KEY, useSessionStore } from "@/features/session";
import { instrument } from "@/shared/instrumentation";

type CounterKey = Exclude<keyof typeof instrument, "reset">;

const COUNTERS: [string, CounterKey][] = [
  ["grade-delay", "gradeDelayMs"],
  ["cover-decodes", "coverDecodes"],
  ["tile-decodes", "tileDecodes"],
  ["choice-taps", "choiceTaps"],
  ["choice-blocked", "choiceBlocked"],
  ["stroke-starts", "strokeStarts"],
  ["applied-results", "appliedResults"],
  ["dropped-results", "droppedResults"],
  ["passage-scroll-y", "passageScrollY"],
  ["question-pane-width", "questionPaneWidth"],
];

const DebugScreen = () => {
  const router = useRouter();
  const [, setTick] = useState(0);
  const sessions = useSessionStore((state) => state.sessions);
  const hydrated = useSessionStore((state) => state.hydrated);
  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 200);
    return () => clearInterval(id);
  }, []);
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable testID="debug-close" onPress={() => router.back()}>
        <Text style={styles.button}>debug-close</Text>
      </Pressable>
      {COUNTERS.map(([id, key]) => (
        <View key={id} style={styles.row}>
          <Text style={styles.label}>{key}</Text>
          <Text testID={`instrument-${id}`} style={styles.value}>
            {String(instrument[key])}
          </Text>
        </View>
      ))}
      <View style={styles.row}>
        <Pressable
          testID="instrument-delay-2500"
          onPress={() => {
            instrument.gradeDelayMs = 2500;
          }}
        >
          <Text style={styles.button}>delay-2500</Text>
        </Pressable>
        <Pressable
          testID="instrument-delay-0"
          onPress={() => {
            instrument.gradeDelayMs = 0;
          }}
        >
          <Text style={styles.button}>delay-0</Text>
        </Pressable>
        <Pressable
          testID="instrument-restore-delay"
          onPress={() => {
            void AsyncStorage.setItem(RESTORE_DELAY_STORAGE_KEY, "8000");
          }}
        >
          <Text style={styles.button}>restore-delay</Text>
        </Pressable>
        <Pressable testID="instrument-reset" onPress={() => instrument.reset()}>
          <Text style={styles.button}>reset</Text>
        </Pressable>
      </View>
      <Text style={styles.label}>hydrated</Text>
      <Text testID="instrument-hydrated" style={styles.value}>
        {String(hydrated)}
      </Text>
      <Text style={styles.label}>sessions</Text>
      <Text testID="instrument-sessions" style={styles.sessions}>
        {JSON.stringify(sessions)}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.screenPadding,
    paddingTop: 60,
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  button: {
    ...theme.typography.label,
    color: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
  },
  sessions: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default DebugScreen;
