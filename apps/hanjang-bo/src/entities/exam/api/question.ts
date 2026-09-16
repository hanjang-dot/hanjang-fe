import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

import type { Question, QuestionInput } from "../model/question";

export const questionsKey = (examPaperId: string) => ["questions", examPaperId] as const;

type QuestionRow = {
  questionId: string;
  examPaperId: string;
  number: number;
  passageImageUrl: string | null;
  prompt: string;
  choices: string[];
  answer: string | null;
};

const toQuestion = (row: QuestionRow): Question => ({
  id: row.questionId,
  examPaperId: row.examPaperId,
  number: row.number,
  passageImageUrl: row.passageImageUrl ?? "",
  passageRegion: null,
  prompt: row.prompt,
  choices: row.choices,
  answer: row.answer ?? "",
});

const toQuestionBody = (input: QuestionInput) => ({
  examPaperId: input.examPaperId,
  number: input.number,
  prompt: input.prompt,
  passageImageUrl: input.passageImageUrl || undefined,
  choices: input.choices,
  answer: input.answer,
});

export const useQuestions = (examPaperId: string) =>
  useQuery({
    queryKey: questionsKey(examPaperId),
    queryFn: () =>
      request((signal) =>
        api.get(`admin/exams/${examPaperId}/questions`, { signal }).json<QuestionRow[]>(),
      ).then((rows) => rows.map(toQuestion)),
  });

export const useSaveQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: QuestionInput }) =>
      request((signal) =>
        id
          ? api
              .patch(`admin/questions/${id}`, { json: toQuestionBody(input), signal })
              .json<QuestionRow>()
          : api
              .post("admin/questions", { json: toQuestionBody(input), signal })
              .json<QuestionRow>(),
      ).then(toQuestion),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: questionsKey(variables.input.examPaperId) }),
  });
};

export const useDeleteQuestion = (examPaperId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request((signal) => api.delete(`admin/questions/${id}`, { signal }).json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionsKey(examPaperId) }),
  });
};
