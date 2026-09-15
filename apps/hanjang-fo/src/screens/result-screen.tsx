import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useExam } from "@/features/exam";
import { useSession, useSessionGrades } from "@/features/session";

interface ResultScreenProps {
  sessionId: string;
}

const ResultScreen = ({ sessionId }: ResultScreenProps) => {
  const router = useRouter();
  const session = useSession(sessionId);
  const grades = useSessionGrades(sessionId);
  const { data } = useExam(session?.examId ?? "");
  if (!session || !data) {
    return <View style={styles.root} />;
  }
  const results = Object.values(grades);
  const correct = results.filter((result) => result.correct).length;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.year}>{data.paper.year}</Text>
      <Text style={styles.title}>{data.paper.title}</Text>
      <Text style={styles.score}>
        {data.questions.length}문항 중 {correct}정답
      </Text>
      <View style={styles.list}>
        {data.questions.map((question) => {
          const grade = grades[question.questionId];
          const myChoice = question.choices.find(
            (choice) => choice.choiceId === grade?.choiceId,
          );
          const answer = question.choices.find(
            (choice) => choice.choiceId === question.correctChoiceId,
          );
          return (
            <View key={question.questionId} style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{question.number}</Text>
              </View>
              <View style={styles.rowMeta}>
                <Text
                  style={[
                    styles.rowResult,
                    grade?.correct ? styles.correct : styles.wrong,
                  ]}
                >
                  {grade ? (grade.correct ? "정답" : "오답") : "미응답"}
                </Text>
                <Text style={styles.rowDetail}>
                  내 답 {myChoice?.label ?? "-"} / 정답 {answer?.label ?? "-"}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <Pressable style={styles.done} onPress={() => router.replace("/")}>
        <Text style={styles.doneText}>목록으로</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  year: {
    ...theme.typography.year,
    color: theme.colors.stamp,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.ink,
  },
  score: {
    ...theme.typography.bodyBold,
    color: theme.colors.ink,
  },
  list: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  badge: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.choiceOnText,
  },
  rowMeta: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowResult: {
    ...theme.typography.bodyBold,
  },
  correct: {
    color: theme.colors.success,
  },
  wrong: {
    color: theme.colors.error,
  },
  rowDetail: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  done: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.navy,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: theme.spacing.lg,
  },
  doneText: {
    ...theme.typography.button,
    color: theme.colors.choiceOnText,
  },
}));

export default ResultScreen;
