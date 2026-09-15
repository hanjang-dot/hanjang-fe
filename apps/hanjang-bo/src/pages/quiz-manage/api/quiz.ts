import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, request } from "@/shared/api/client";

import type { Quiz, QuizInput } from "../model/quiz";

export const QUIZZES_KEY = ["quizzes"] as const;

export const useQuizzes = () =>
  useQuery({
    queryKey: QUIZZES_KEY,
    queryFn: () => request((signal) => api.get("admin/quizzes", { signal }).json<Quiz[]>()),
  });

export const useSaveQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: QuizInput }) =>
      request((signal) =>
        id
          ? api.patch(`admin/quizzes/${id}`, { json: input, signal }).json<Quiz>()
          : api.post("admin/quizzes", { json: input, signal }).json<Quiz>(),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUIZZES_KEY }),
  });
};

export const useSetQuizPublished = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      request((signal) =>
        api
          .patch(`admin/quizzes/${id}/publish`, { json: { published }, signal })
          .json<Quiz>(),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUIZZES_KEY }),
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request((signal) => api.delete(`admin/quizzes/${id}`, { signal }).json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUIZZES_KEY }),
  });
};
