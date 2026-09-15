import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ExamRow, useExamPapers } from "@/features/exam";
import { useBookmarkedPapers, useToggleBookmark } from "@/features/bookmark";
import { SectionHeader } from "@/shared/components";
import { useVisibleIds } from "@/shared/hooks";

const SavedScreen = () => {
  const router = useRouter();
  const { data: papers = [] } = useExamPapers();
  const saved = useBookmarkedPapers(papers);
  const toggleBookmark = useToggleBookmark();
  const { visibleIds, onViewableItemsChanged } = useVisibleIds();
  return (
    <View style={styles.root}>
      <SectionHeader title="저장한 회차" />
      {saved.length === 0 ? (
        <Text style={styles.empty}>자료실에서 회차를 저장하세요</Text>
      ) : (
        <LegendList
          data={saved}
          keyExtractor={(paper) => paper.examId}
          recycleItems
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item: paper }) => (
            <ExamRow
              paper={paper}
              bookmarked
              visible={visibleIds.has(paper.examId)}
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
    backgroundColor: theme.colors.paper,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.muted,
    padding: theme.spacing.lg,
  },
}));

export default SavedScreen;
