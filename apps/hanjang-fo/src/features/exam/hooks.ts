import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { fetchExam, fetchExamPapers, fetchExamPapersPage } from "./api";
import { EXAM_PAPERS_QUERY_KEY, examQueryKey } from "./constants";
import { dedupePages } from "./list-utils";

export const useExamPapers = () =>
  useQuery({
    queryKey: EXAM_PAPERS_QUERY_KEY,
    queryFn: fetchExamPapers,
  });

export const useExamPapersPaged = () => {
  const query = useInfiniteQuery({
    queryKey: [...EXAM_PAPERS_QUERY_KEY, "paged"],
    queryFn: ({ pageParam }) => fetchExamPapersPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length : undefined,
  });
  const { items, freshCounts } = useMemo(
    () => dedupePages(query.data?.pages ?? []),
    [query.data],
  );
  return { ...query, papers: items, freshCounts };
};

export const useExam = (examId: string, enabled = true) =>
  useQuery({
    queryKey: examQueryKey(examId),
    queryFn: () => fetchExam(examId),
    enabled: enabled && examId.length > 0,
  });
