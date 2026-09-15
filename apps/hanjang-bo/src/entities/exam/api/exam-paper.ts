import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

import type { ExamPaper, ExamPaperInput } from "../model/exam-paper";

export const EXAM_PAPERS_KEY = ["examPapers"] as const;

export const useExamPapers = () =>
  useQuery({
    queryKey: EXAM_PAPERS_KEY,
    queryFn: () => request((signal) => api.get("admin/exams", { signal }).json<ExamPaper[]>()),
  });

export const useCreateExamPaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExamPaperInput) =>
      request((signal) =>
        api.post("admin/exams", { json: input, signal }).json<ExamPaper>(),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAM_PAPERS_KEY }),
  });
};

export const useSetExamPaperPublished = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      request((signal) =>
        api
          .patch(`admin/exams/${id}/publish`, { json: { published }, signal })
          .json<ExamPaper>(),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAM_PAPERS_KEY }),
  });
};
