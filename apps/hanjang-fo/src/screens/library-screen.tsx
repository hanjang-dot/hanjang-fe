import { LegendList } from "@legendapp/list/react-native";
import { useIsOffline } from "@/shared/hooks";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  ExamCard,
  canFetchNext,
  useExamPapersPaged,
} from "@/features/exam";
import { useBookmarkIds, useToggleBookmark } from "@/features/bookmark";
import {
  EmptyState,
  ErrorState,
  OfflineBanner,
  SkeletonCard,
} from "@/shared/components";

const LibraryScreen = () => {
  const router = useRouter();
  const {
    papers,
    freshCounts,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
  } = useExamPapersPaged();
  const bookmarkIds = useBookmarkIds();
  const toggleBookmark = useToggleBookmark();
  const isOffline = useIsOffline();

  return (
    <View style={styles.root}>
      {isOffline ? <OfflineBanner /> : null}
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <ErrorState
          desc="시험지 목록을 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요."
          onRetry={() => refetch()}
        />
      ) : papers.length === 0 ? (
        <EmptyState
          desc="아직 발행된 시험지가 없습니다"
          actionLabel="다시 불러오기"
          onAction={() => refetch()}
        />
      ) : (
        <LegendList
          data={papers}
          keyExtractor={(paper) => paper.examId}
          recycleItems
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (isFetchingNextPage) return;
            if (canFetchNext(Boolean(hasNextPage), freshCounts)) {
              fetchNextPage();
            }
          }}
          renderItem={({ item: paper }) => (
            <ExamCard
              paper={paper}
              bookmarked={bookmarkIds.includes(paper.examId)}
              primaryAction
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

export default LibraryScreen;
