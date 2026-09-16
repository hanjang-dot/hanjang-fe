import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

import type { ExamPaper, ExamPaperInput } from "../model/exam-paper";

export const EXAM_PAPERS_KEY = ["examPapers"] as const;

type ExamPaperRow = {
  examPaperId: string;
  title: string;
  round: string;
  subject: string;
  year: number;
  coverImageUrl: string | null;
  timeLimitSec: number;
  publishedAt: string | null;
};

const toExamPaper = (row: ExamPaperRow): ExamPaper => ({
  id: row.examPaperId,
  round: row.round,
  subject: row.subject,
  year: row.year,
  coverImageUrl: row.coverImageUrl ?? "",
  timeLimitMinutes: Math.round(row.timeLimitSec / 60),
  published: row.publishedAt !== null,
});

const toExamPaperBody = (input: ExamPaperInput) => ({
  title: `${input.round} ${input.subject}`.trim(),
  round: input.round,
  subject: input.subject,
  year: input.year,
  coverImageUrl: input.coverImageUrl || undefined,
  timeLimitSec: input.timeLimitMinutes * 60,
});

export const useExamPapers = () =>
  useQuery({
    queryKey: EXAM_PAPERS_KEY,
    queryFn: () =>
      request((signal) =>
        api.get("admin/exams", { signal }).json<ExamPaperRow[]>(),
      ).then((rows) => rows.map(toExamPaper)),
  });

export const useCreateExamPaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExamPaperInput) =>
      request((signal) =>
        api
          .post("admin/exams", { json: toExamPaperBody(input), signal })
          .json<ExamPaperRow>(),
      ).then(toExamPaper),
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
          .json<ExamPaperRow>(),
      ).then(toExamPaper),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAM_PAPERS_KEY }),
  });
};
