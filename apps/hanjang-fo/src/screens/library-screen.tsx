import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  ExamRow,
  canFetchNext,
  useExamPapersPaged,
} from "@/features/exam";
import { useBookmarkIds, useToggleBookmark } from "@/features/bookmark";
import { SectionHeader } from "@/shared/components";
import { useVisibleIds } from "@/shared/hooks";

const LibraryScreen = () => {
  const router = useRouter();
  const {
    papers,
    freshCounts,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useExamPapersPaged();
  const bookmarkIds = useBookmarkIds();
  const toggleBookmark = useToggleBookmark();
  const { visibleIds, onViewableItemsChanged } = useVisibleIds();
  return (
    <View style={styles.root}>
      <SectionHeader title="풀 시험지를 고르세요" />
      <LegendList
        data={papers}
        keyExtractor={(paper) => paper.examId}
        recycleItems
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReached={() => {
          if (isFetchingNextPage) return;
          if (canFetchNext(Boolean(hasNextPage), freshCounts)) {
            fetchNextPage();
          }
        }}
        renderItem={({ item: paper }) => (
          <ExamRow
            paper={paper}
            bookmarked={bookmarkIds.includes(paper.examId)}
            visible={visibleIds.has(paper.examId)}
            onPress={() => router.push(`/exam/${paper.examId}`)}
            onToggleBookmark={() => toggleBookmark(paper.examId)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
}));

export default LibraryScreen;
