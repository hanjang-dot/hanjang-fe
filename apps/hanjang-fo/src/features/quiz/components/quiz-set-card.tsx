import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useTodayQuizSet } from "../hooks";
import { useQuizRunStore } from "../store";

import {
  EXPERIMENTS,
  trackExperimentEvent,
  useExperiment,
} from "@/features/experiments";

const QuizSetCard = () => {
  const router = useRouter();
  const { data } = useTodayQuizSet();
  const begin = useQuizRunStore((state) => state.begin);
  const variant = useExperiment(EXPERIMENTS.homeStartCta);
  const start = () => {
    trackExperimentEvent(EXPERIMENTS.homeStartCta, "conversion", { variant });
    begin(data?.quizzes.map((quiz) => quiz.quizId) ?? []);
    router.push("/quiz");
  };
  return (
    <Pressable
      accessible
      accessibilityLabel="오늘의 퀴즈"
      accessibilityRole="button"
      onPress={start}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.meta}>
        <Text style={styles.title}>오늘의 퀴즈</Text>
        <Text style={styles.desc}>OX · 빈칸 · 영단어 · 한국사</Text>
        <Text style={styles.caption}>
          {data ? `${data.quizzes.length}문제 세트` : "불러오는 중"}
        </Text>
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
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.body,
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.colors.text,
  },
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default QuizSetCard;
