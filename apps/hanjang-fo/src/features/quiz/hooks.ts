import { useQuery } from "@tanstack/react-query";

import { fetchTodayQuizSet } from "./api";

const TODAY_QUIZ_QUERY_KEY = ["quiz", "today"] as const;

export const useTodayQuizSet = () =>
  useQuery({
    queryKey: TODAY_QUIZ_QUERY_KEY,
    queryFn: fetchTodayQuizSet,
  });
