import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

import type { Question, QuestionInput } from "../model/question";

export const questionsKey = (examPaperId: string) => ["questions", examPaperId] as const;

export const useQuestions = (examPaperId: string) =>
  useQuery({
    queryKey: questionsKey(examPaperId),
    queryFn: () =>
      request((signal) =>
        api.get(`admin/exams/${examPaperId}/questions`, { signal }).json<Question[]>(),
      ),
  });

export const useSaveQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: QuestionInput }) =>
      request((signal) =>
        id
          ? api.patch(`admin/questions/${id}`, { json: input, signal }).json<Question>()
          : api
              .post(`admin/exams/${input.examPaperId}/questions`, { json: input, signal })
              .json<Question>(),
      ),
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
