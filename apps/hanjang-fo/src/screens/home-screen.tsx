import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ExamRow, useExamPapers } from "@/features/exam";
import { useBookmarkIds, useToggleBookmark } from "@/features/bookmark";
import { QuizSetCard } from "@/features/quiz";
import { useActiveSession } from "@/features/session";
import { SectionHeader } from "@/shared/components";

const RECENT_COUNT = 3;

const HomeScreen = () => {
  const router = useRouter();
  const { data: papers = [] } = useExamPapers();
  const bookmarkIds = useBookmarkIds();
  const toggleBookmark = useToggleBookmark();
  const activeSession = useActiveSession();
  const activePaper = papers.find(
    (paper) => paper.examId === activeSession?.examId,
  );
  const recent = papers.slice(0, RECENT_COUNT);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {activeSession ? (
        <View>
          <SectionHeader title="이어하기" />
          <View style={styles.section}>
            <Pressable
              style={styles.resume}
              onPress={() => router.push(`/exam/${activeSession.examId}`)}
            >
              <Text style={styles.resumeTitle}>
                {activePaper?.title ?? activeSession.examId}
              </Text>
              <Text style={styles.resumeCaption}>
                풀던 시험지로 돌아간다
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      <SectionHeader title="오늘의 퀴즈" />
      <View style={styles.section}>
        <QuizSetCard />
      </View>
      <SectionHeader title="최근 회차" />
      <View>
        {recent.map((paper) => (
          <ExamRow
            key={paper.examId}
            paper={paper}
            bookmarked={bookmarkIds.includes(paper.examId)}
            visible
            onPress={() => router.push(`/exam/${paper.examId}`)}
            onToggleBookmark={() => toggleBookmark(paper.examId)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
  },
  resume: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  resumeTitle: {
    ...theme.typography.title,
    color: theme.colors.ink,
  },
  resumeCaption: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
}));

export default HomeScreen;
