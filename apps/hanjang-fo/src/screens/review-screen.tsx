import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useExamPapers } from "@/features/exam";
import { useGradedSessions, useSessionStore } from "@/features/session";
import { SectionHeader } from "@/shared/components";

const ReviewScreen = () => {
  const router = useRouter();
  const sessions = useGradedSessions();
  const grades = useSessionStore((state) => state.grades);
  const { data: papers = [] } = useExamPapers();
  return (
    <View style={styles.root}>
      <SectionHeader title="복습" />
      {sessions.length === 0 ? (
        <Text style={styles.empty}>채점이 끝난 세션이 없습니다</Text>
      ) : (
        <LegendList
          data={sessions}
          keyExtractor={(session) => session.sessionId}
          recycleItems
          renderItem={({ item: session }) => {
            const paper = papers.find(
              (item) => item.examId === session.examId,
            );
            const results = Object.values(grades[session.sessionId] ?? {});
            const correct = results.filter((result) => result.correct).length;
            return (
              <Pressable
                style={styles.row}
                onPress={() => router.push(`/result/${session.sessionId}`)}
              >
                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={1}>
                    {paper?.title ?? session.examId}
                  </Text>
                  <Text style={styles.caption}>
                    {results.length}문항 중 {correct}정답
                  </Text>
                </View>
              </Pressable>
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
    backgroundColor: theme.colors.paper,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.muted,
    padding: theme.spacing.lg,
  },
  row: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  meta: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
}));

export default ReviewScreen;
