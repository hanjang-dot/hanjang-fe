import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useExamPapers } from "@/features/exam";
import { useGradedSessions, useSessionStore } from "@/features/session";
import { Button, EmptyState, SkeletonCard } from "@/shared/components";

const ReviewScreen = () => {
  const router = useRouter();
  const sessions = useGradedSessions();
  const grades = useSessionStore((state) => state.grades);
  const { data: papers = [], isLoading } = useExamPapers();

  return (
    <View style={styles.root}>
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon="history"
          desc="채점이 끝난 세션이 없습니다"
          actionLabel="시험지 풀기"
          onAction={() => router.push("/library")}
        />
      ) : (
        <LegendList
          data={sessions}
          keyExtractor={(session) => session.sessionId}
          recycleItems
          contentContainerStyle={styles.listContent}
          renderItem={({ item: session }) => {
            const paper = papers.find(
              (item) => item.examId === session.examId,
            );
            const results = Object.values(grades[session.sessionId] ?? {});
            const correct = results.filter((result) => result.correct).length;
            return (
              <View style={styles.card}>
                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={2}>
                    {paper?.title ?? session.examId}
                  </Text>
                  <Text style={styles.desc}>채점 완료</Text>
                  <Text style={styles.caption}>
                    정답 {correct}/{results.length}
                  </Text>
                </View>
                <Button
                  label="다시 보기"
                  variant="primary"
                  size="md"
                  onPress={() =>
                    router.push(`/exam-result/${session.sessionId}`)
                  }
                />
              </View>
            );
          }}
        />
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
  listContent: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.cardPadding,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.sm,
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
  desc: {
    ...theme.typography.bodySm,
    color: theme.colors.textMuted,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
}));

export default ReviewScreen;
