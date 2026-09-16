import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ExamCard, useExamPapers } from "@/features/exam";
import { useBookmarkedPapers, useToggleBookmark } from "@/features/bookmark";
import { EmptyState, SkeletonCard } from "@/shared/components";

const SavedScreen = () => {
  const router = useRouter();
  const { data: papers = [], isLoading } = useExamPapers();
  const saved = useBookmarkedPapers(papers);
  const toggleBookmark = useToggleBookmark();

  return (
    <View style={styles.root}>
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : saved.length === 0 ? (
        <EmptyState
          desc="자료실에서 회차를 저장하세요"
          actionLabel="자료실로"
          onAction={() => router.push("/library")}
        />
      ) : (
        <LegendList
          data={saved}
          keyExtractor={(paper) => paper.examId}
          recycleItems
          contentContainerStyle={styles.listContent}
          renderItem={({ item: paper }) => (
            <ExamCard
              paper={paper}
              bookmarked
              primaryAction
              desc="북마크됨"
              onPress={() => router.push(`/exam/${paper.examId}`)}
              onToggleBookmark={() => toggleBookmark(paper.examId)}
            />
          )}
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
}));

export default SavedScreen;
