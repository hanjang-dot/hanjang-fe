import { useBookmarkStore } from "./store";

import type { ExamPaper } from "@/features/exam";

export const useBookmarkIds = () =>
  useBookmarkStore((state) => state.examIds);

export const useToggleBookmark = () =>
  useBookmarkStore((state) => state.toggle);

export const useBookmarkedPapers = (papers: ExamPaper[]): ExamPaper[] => {
  const examIds = useBookmarkIds();
  return papers.filter((paper) => examIds.includes(paper.examId));
};
