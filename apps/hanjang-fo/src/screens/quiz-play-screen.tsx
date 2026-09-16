import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import {
  TfRow,
  useQuizRunStore,
  useTodayQuizSet,
} from "@/features/quiz";
import {
  Button,
  BottomCta,
  ChoiceButton,
  ErrorState,
  Icon,
  ProgressBar,
  SkeletonCard,
} from "@/shared/components";

import type { ChoiceState } from "@/shared/components";
import type { Quiz } from "@/features/quiz";

const QUIZ_TYPE_LABELS: Record<Quiz["type"], string> = {
  ox: "OX",
  cloze: "빈칸",
  word: "영단어",
  history: "한국사",
};

const quizPrompt = (quiz: Quiz) => {
  if (quiz.type !== "word") return quiz.prompt;
  return quiz.direction === "ko-en"
    ? `"${quiz.prompt}"에 해당하는 영어는?`
    : `"${quiz.prompt}"을 뜻하는 것은?`;
};

const directionLabel = (quiz: Quiz) => {
  if (quiz.type !== "word") return null;
  return quiz.direction === "ko-en" ? "KO → EN" : "EN → KO";
};

const QuizPlayScreen = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: quizSet, isLoading, isError, refetch } = useTodayQuizSet();
  const index = useQuizRunStore((state) => state.index);
  const answers = useQuizRunStore((state) => state.answers);
  const select = useQuizRunStore((state) => state.select);
  const next = useQuizRunStore((state) => state.next);

  const quizzes = quizSet?.quizzes ?? [];
  const quiz = quizzes[Math.min(index, quizzes.length - 1)];
  const answer = quiz ? answers[quiz.quizId] : undefined;
  const isLast = index === quizzes.length - 1;

  const confirmExit = () =>
    Alert.alert("퀴즈를 나갈까요?", "진행 중인 답안은 저장되지 않습니다.", [
      { text: "계속 풀기", style: "cancel" },
      {
        text: "나가기",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);

  const advance = () => {
    if (isLast) {
      router.replace("/quiz-result");
      return;
    }
    next();
  };

  const choiceState = (choiceIndex: number): ChoiceState => {
    if (!answer || !quiz) return "default";
    if (choiceIndex === quiz.answerIndex) return "correct";
    if (choiceIndex === answer.choiceIndex) return "wrong";
    return "default";
  };

  const headerLeft = () => (
    <View style={styles.headerLeft}>
      <Pressable
        accessibilityLabel="뒤로"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => router.back()}
        style={styles.headerButton}
      >
        <Icon name="chevronLeft" color={theme.colors.text} />
      </Pressable>
      {quiz ? (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {QUIZ_TYPE_LABELS[quiz.type]} 퀴즈
        </Text>
      ) : null}
    </View>
  );
  const headerRight = () => (
    <Pressable
      accessibilityLabel="나가기"
      accessibilityRole="button"
      hitSlop={8}
      onPress={confirmExit}
      style={styles.headerButton}
    >
      <Icon name="doorOpen" color={theme.colors.text} />
    </Pressable>
  );

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
          headerTitle: () =>
            quizzes.length > 0 ? (
              <Text style={styles.progress}>
                {index + 1} / {quizzes.length}
              </Text>
            ) : null,
          headerRight,
          title: "",
        }}
      />
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError || !quiz ? (
        <ErrorState
          desc="퀴즈를 불러오지 못했습니다. 다시 시도해 주세요."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ProgressBar progress={index / quizzes.length} />
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              {directionLabel(quiz) ? (
                <Text style={styles.direction}>{directionLabel(quiz)}</Text>
              ) : null}
              <Text style={styles.prompt}>{quizPrompt(quiz)}</Text>
              <Text style={styles.desc}>다음 중 알맞은 것을 고르세요</Text>
            </View>
            {quiz.type === "ox" ? (
              <TfRow
                selectedIndex={answer?.choiceIndex ?? null}
                answerIndex={answer ? quiz.answerIndex : null}
                onSelect={(choiceIndex) => select(quiz, choiceIndex)}
              />
            ) : (
              <View style={styles.choices}>
                {quiz.choices.map((choice, choiceIndex) => (
                  <ChoiceButton
                    key={`${quiz.quizId}-${choiceIndex}`}
                    index={String(choiceIndex + 1)}
                    text={choice}
                    state={choiceState(choiceIndex)}
                    onPress={() => select(quiz, choiceIndex)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
          <BottomCta>
            <Button
              label={isLast ? "결과 보기" : "다음 문제"}
              variant="primary"
              size="lg"
              full
              disabled={!answer}
              onPress={advance}
            />
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
    gap: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerButton: {
    minWidth: theme.sizes.tapMin,
    minHeight: theme.sizes.tapMin,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    maxWidth: 140,
  },
  progress: {
    ...theme.typography.label,
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  content: {
    padding: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
    boxShadow: theme.shadows.sm,
  },
  direction: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  prompt: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  choices: {
    gap: theme.spacing.sm,
  },
}));

export default QuizPlayScreen;
