import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { trackExperimentEvent } from "../api";
import { EXPERIMENTS } from "../constants";
import { useExperiment, useWrongAnswerCount } from "../hooks";

const ReviewPromptCard = () => {
  const router = useRouter();
  const variant = useExperiment(EXPERIMENTS.reviewPrompt);
  const wrongCount = useWrongAnswerCount();
  const visible = variant === "B" && wrongCount > 0;
  const exposedRef = useRef(false);
  useEffect(() => {
    if (visible && !exposedRef.current) {
      exposedRef.current = true;
      trackExperimentEvent(EXPERIMENTS.reviewPrompt, "exposure", {
        wrongCount,
      });
    }
  }, [visible, wrongCount]);
  if (!visible) return null;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        trackExperimentEvent(EXPERIMENTS.reviewPrompt, "conversion", {
          wrongCount,
        });
        router.push("/review");
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.meta}>
        <Text style={styles.title}>틀린 문제 {wrongCount}개 복습하세요</Text>
        <Text style={styles.caption}>복습 탭으로 이동</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing.screenPadding,
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.sm,
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
    shadowOpacity: 0,
    elevation: 0,
  },
  meta: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  title: {
    ...theme.typography.body,
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default ReviewPromptCard;
