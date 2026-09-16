import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import {
  EXPERIMENTS,
  trackExperimentEvent,
  useExperiment,
} from "@/features/experiments";
import { useQuizRunStore, useTodayQuizSet } from "@/features/quiz";
import {
  Button,
  BottomCta,
  ErrorState,
  Icon,
  ListRow,
  ScoreRing,
  SkeletonCard,
} from "@/shared/components";

const QuizResultScreen = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: quizSet, isLoading, isError, refetch } = useTodayQuizSet();
  const reset = useQuizRunStore((state) => state.reset);
  const answers = useQuizRunStore((state) => state.answers);
  const ctaVariant = useExperiment(EXPERIMENTS.quizResultCta);

  const goHome = () => {
    reset();
    router.dismissTo("/");
  };

  const replay = () => {
    reset();
    router.replace("/quiz");
  };

  const startNextSet = () => {
    trackExperimentEvent(EXPERIMENTS.quizResultCta, "conversion");
    replay();
  };

  const headerLeft = () => (
    <Pressable
      accessibilityLabel="뒤로"
      accessibilityRole="button"
      hitSlop={8}
      onPress={goHome}
      style={styles.headerButton}
    >
      <Icon name="chevronLeft" color={theme.colors.text} />
    </Pressable>
  );

  const quizzes = quizSet?.quizzes ?? [];
  const results = quizzes
    .map((quiz) => answers[quiz.quizId])
    .filter((answer) => answer !== undefined);
  const correct = results.filter((answer) => answer.correct).length;
  const wrong = quizzes
    .map((quiz) => ({ quiz, answer: answers[quiz.quizId] }))
    .filter(({ answer }) => answer && !answer.correct);

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
          title: "퀴즈 결과",
          headerTitleStyle: {
            fontFamily: theme.typography.h3.fontFamily,
            fontSize: theme.typography.h3.fontSize,
            color: theme.colors.text,
          },
        }}
      />
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError || !quizSet ? (
        <ErrorState
          desc="결과를 불러오지 못했습니다. 다시 시도해 주세요."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.ringWrap}>
              <ScoreRing correct={correct} total={quizzes.length} />
            </View>
            {wrong.length > 0 ? (
              <View style={styles.rows}>
                <Text style={styles.rowsTitle}>틀린 문항</Text>
                {wrong.map(({ quiz, answer }) => (
                  <ListRow
                    key={quiz.quizId}
                    title={`${quiz.prompt} — ${quiz.choices[quiz.answerIndex]}`}
                    meta={`오답: ${quiz.choices[answer?.choiceIndex ?? -1] ?? "-"} 선택`}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.perfect}>모두 정답입니다</Text>
            )}
          </ScrollView>
          <BottomCta>
            {ctaVariant === "B" ? (
              <>
                <Button
                  label="다시 풀기"
                  variant="secondary"
                  size="lg"
                  onPress={replay}
                />
                <Button
                  label="다음 세트 시작"
                  variant="primary"
                  size="lg"
                  full
                  onPress={startNextSet}
                />
              </>
            ) : (
              <Button
                label="다시 풀기"
                variant="primary"
                size="lg"
                full
                onPress={replay}
              />
            )}
          </BottomCta>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loading: {
    padding: theme.spacing.screenPadding,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  headerButton: {
    minWidth: theme.sizes.tapMin,
    minHeight: theme.sizes.tapMin,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.section,
  },
  ringWrap: {
    alignItems: "center",
  },
  rows: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  rowsTitle: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface1,
  },
  perfect: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
}));

export default QuizResultScreen;
