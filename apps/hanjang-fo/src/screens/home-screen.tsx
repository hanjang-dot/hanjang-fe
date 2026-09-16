import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useExam, useExamPapers } from "@/features/exam";
import { QuizSetCard } from "@/features/quiz";
import { useActiveSession } from "@/features/session";
import {
  Button,
  ErrorState,
  ProgressBar,
  SkeletonCard,
} from "@/shared/components";
import { formatRemaining } from "@/shared/utils";

const HomeScreen = () => {
  const router = useRouter();
  const { data: papers = [], isLoading, isError, refetch } = useExamPapers();
  const activeSession = useActiveSession();
  const { data: activeExam } = useExam(
    activeSession?.examId ?? "",
    activeSession !== null,
  );
  const answeredCount = activeSession
    ? Object.keys(activeSession.answers).length
    : 0;
  const totalCount =
    activeExam?.questions.length ??
    activeExam?.paper.questionCount ??
    0;
  const latest = papers[0];

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }
  if (isError) {
    return (
      <ErrorState
        desc="목록을 불러오지 못했습니다. 다시 시도해 주세요."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >
      {activeSession ? (
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardMeta}>
              <Text style={styles.cardTitle}>이어하기</Text>
              <Text style={styles.cardDesc} numberOfLines={1}>
                {activeExam?.paper.title ?? activeSession.examId}
              </Text>
              <Text style={styles.cardCaption}>
                남은 시간{" "}
                {formatRemaining(activeSession.deadlineAt - Date.now())}
              </Text>
            </View>
            <Button
              label="이어하기"
              variant="primary"
              size="md"
              icon="play"
              onPress={() =>
                router.push(`/exam/${activeSession.examId}`)
              }
            />
          </View>
          <ProgressBar
            progress={totalCount > 0 ? answeredCount / totalCount : 0}
          />
        </View>
      ) : null}
      <QuizSetCard />
      {latest ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/library")}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.cardMeta}>
            <Text style={styles.cardTitle}>최근 발행</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>
              {latest.title}
            </Text>
            <Text style={styles.cardCaption}>
              {papers.length > 1 ? `외 ${papers.length - 1}회차` : "1회차"}
            </Text>
          </View>
        </Pressable>
      ) : null}
    </ScrollView>
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
    gap: theme.spacing.lg,
  },
  loading: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.screenPadding,
    gap: theme.spacing.lg,
  },
  card: {
    marginHorizontal: theme.spacing.screenPadding,
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
    boxShadow: theme.shadows.sm,
  },
  pressed: {
    backgroundColor: theme.colors.surface2,
    shadowOpacity: 0,
    elevation: 0,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  cardMeta: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  cardTitle: {
    ...theme.typography.body,
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.colors.text,
  },
  cardDesc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  cardCaption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default HomeScreen;
