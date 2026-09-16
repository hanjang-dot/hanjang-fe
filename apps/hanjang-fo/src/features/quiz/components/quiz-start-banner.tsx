import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useTodayQuizSet } from "../hooks";
import { useQuizRunStore } from "../store";

import {
  EXPERIMENTS,
  trackExperimentEvent,
  useExperiment,
} from "@/features/experiments";
import { Button } from "@/shared/components";

const QuizStartBanner = () => {
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
    <View style={styles.banner}>
      <View style={styles.meta}>
        <Text style={styles.title}>오늘의 퀴즈</Text>
        <Text style={styles.desc}>OX · 빈칸 · 영단어 · 한국사</Text>
        <Text style={styles.caption}>
          {data ? `${data.quizzes.length}문제 세트` : "불러오는 중"}
        </Text>
      </View>
      <Button
        label="시작하기"
        variant="primary"
        size="md"
        icon="play"
        onPress={start}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  banner: {
    marginHorizontal: theme.spacing.screenPadding,
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  meta: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.accent,
  },
}));

export default QuizStartBanner;
