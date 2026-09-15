import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useTodayQuizSet } from "../hooks";

const QUIZ_TYPE_LABELS: Record<string, string> = {
  ox: "OX",
  cloze: "빈칸",
  word: "영단어",
  history: "한국사",
};

const QuizSetCard = () => {
  const { data } = useTodayQuizSet();
  const types = [...new Set(data?.quizzes.map((quiz) => quiz.type) ?? [])];
  return (
    <Pressable style={styles.card}>
      <Text style={styles.title}>오늘의 퀴즈</Text>
      <Text style={styles.caption}>
        {data ? `${data.quizzes.length}문제 1세트` : "불러오는 중"}
      </Text>
      <View style={styles.types}>
        {types.map((type) => (
          <View key={type} style={styles.chip}>
            <Text style={styles.chipText}>{QUIZ_TYPE_LABELS[type]}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  types: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
}));

export default QuizSetCard;
