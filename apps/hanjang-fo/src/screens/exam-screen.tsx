import { useIsOffline } from "@/shared/hooks";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import {
  EXAM_TIMER_LAST_SECONDS,
  ExamTimer,
  PassagePane,
  QuestionBlock,
  useExam,
} from "@/features/exam";
import {
  EXPERIMENTS,
  trackExperimentEvent,
  useExperiment,
} from "@/features/experiments";
import {
  useExamSession,
  useSessionStore,
} from "@/features/session";
import {
  Button,
  BottomCta,
  EmptyState,
  ErrorState,
  Icon,
  OfflineBanner,
  SkeletonCard,
} from "@/shared/components";

interface ExamScreenProps {
  examId: string;
}

const ExamScreen = ({ examId }: ExamScreenProps) => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data, isLoading, isError, refetch } = useExam(examId);
  const session = useExamSession(examId, data?.paper.timeLimitSec);
  const submitSession = useSessionStore((state) => state.submitSession);
  const addStroke = useSessionStore((state) => state.addStroke);
  const isOffline = useIsOffline();
  const examTimerVariant = useExperiment(EXPERIMENTS.examTimer);
  const sessionId = session?.sessionId;

  useEffect(() => {
    if (!sessionId) return;
    trackExperimentEvent(EXPERIMENTS.examTimer, "exposure", {
      examId,
      sessionId,
    });
  }, [examId, sessionId]);

  const confirmExit = () =>
    Alert.alert("시험을 나갈까요?", "답안은 이 기기에 저장됩니다.", [
      { text: "계속 풀기", style: "cancel" },
      {
        text: "나가기",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);

  const submit = () => {
    if (!session) return;
    trackExperimentEvent(EXPERIMENTS.examTimer, "conversion", {
      examId,
      sessionId: session.sessionId,
    });
    submitSession(session.sessionId);
    router.replace(`/exam-result/${session.sessionId}`);
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
      {data ? (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {data.paper.subject}
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
            session ? (
              <ExamTimer
                deadlineAt={session.deadlineAt}
                showBelowSec={
                  examTimerVariant === "B" ? EXAM_TIMER_LAST_SECONDS : undefined
                }
              />
            ) : null,
          headerRight,
          title: "",
        }}
      />
      {isOffline ? <OfflineBanner /> : null}
      {isLoading || !session ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <ErrorState
          desc="시험지를 불러오지 못했습니다. 다시 시도해 주세요."
          onRetry={() => refetch()}
        />
      ) : !data || data.questions.length === 0 ? (
        <EmptyState
          desc="시험지를 찾지 못했습니다"
          actionLabel="자료실로"
          onAction={() => router.replace("/library")}
        />
      ) : (
        <>
          <View style={styles.panes}>
            <PassagePane
              questions={data.questions}
              onStroke={(points) =>
                addStroke(session.sessionId, { points })
              }
            />
            <ScrollView style={styles.questions}>
              {data.questions.map((question) => (
                <QuestionBlock
                  key={question.questionId}
                  session={session}
                  question={question}
                />
              ))}
            </ScrollView>
          </View>
          <BottomCta>
            <Button
              label="제출"
              variant="primary"
              size="lg"
              full
              onPress={submit}
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
  panes: {
    flex: 1,
    flexDirection: {
      phone: "column",
      tablet: "row",
    },
  },
  questions: {
    flex: 1,
  },
}));

export default ExamScreen;
