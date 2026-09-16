import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { useExam } from "@/features/exam";
import { useSession, useSessionGrades } from "@/features/session";
import {
  Button,
  BottomCta,
  EmptyState,
  Icon,
  ListRow,
} from "@/shared/components";

interface ExamResultScreenProps {
  sessionId: string;
}

const ExamResultScreen = ({ sessionId }: ExamResultScreenProps) => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const session = useSession(sessionId);
  const grades = useSessionGrades(sessionId);
  const { data } = useExam(session?.examId ?? "", session !== null);

  const headerLeft = () => (
    <Pressable
      accessibilityLabel="뒤로"
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => router.back()}
      style={styles.headerButton}
    >
      <Icon name="chevronLeft" color={theme.colors.text} />
    </Pressable>
  );

  if (!session || !data) {
    return (
      <View style={styles.root}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: theme.colors.bg },
            headerShadowVisible: false,
            headerLeft,
            title: "결과",
            headerTitleStyle: {
              fontFamily: theme.typography.h3.fontFamily,
              fontSize: theme.typography.h3.fontSize,
              color: theme.colors.text,
            },
          }}
        />
        <EmptyState
          desc="결과를 찾지 못했습니다"
          actionLabel="자료실로"
          onAction={() => router.replace("/library")}
        />
      </View>
    );
  }

  const results = Object.values(grades);
  const correct = results.filter((result) => result.correct).length;

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: theme.colors.bg },
          headerShadowVisible: false,
          headerLeft,
          title: "결과",
          headerTitleStyle: {
            fontFamily: theme.typography.h3.fontFamily,
            fontSize: theme.typography.h3.fontSize,
            color: theme.colors.text,
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.score}>
            정답 {correct}/{data.questions.length}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {data.paper.title}
          </Text>
        </View>
        <View style={styles.rows}>
          {data.questions.map((question) => {
            const grade = grades[question.questionId];
            const myChoice = question.choices.find(
              (choice) => choice.choiceId === grade?.choiceId,
            );
            const meta = grade
              ? grade.correct
                ? "정답"
                : `오답 — ${myChoice?.label ?? "-"} 선택`
              : "미응답";
            return (
              <ListRow
                key={question.questionId}
                title={`${question.number}번 문항`}
                meta={meta}
              />
            );
          })}
        </View>
      </ScrollView>
      <BottomCta>
        <Button
          label="자료실로"
          variant="primary"
          size="lg"
          full
          onPress={() => router.replace("/library")}
        />
      </BottomCta>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.section,
  },
  headerButton: {
    minWidth: theme.sizes.tapMin,
    minHeight: theme.sizes.tapMin,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginHorizontal: theme.spacing.screenPadding,
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
    boxShadow: theme.shadows.sm,
  },
  score: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  rows: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
}));

export default ExamResultScreen;
