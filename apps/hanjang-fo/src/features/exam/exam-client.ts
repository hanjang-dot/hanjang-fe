import { Effect } from "effect";
import ky, { HTTPError } from "ky";

import { RETRY_READS, toError, withTimeout } from "@/shared/utils";

import type { ExamDetail, ExamPaper } from "./types";

export interface ExamClient {
  listPapers: () => Effect.Effect<ExamPaper[], unknown>;
  listPapersPage: (page: number) => Effect.Effect<ExamPaper[], unknown>;
  getExam: (examId: string) => Effect.Effect<ExamDetail | null, unknown>;
}

export const createKyExamClient = (prefixUrl: string): ExamClient => {
  const http = ky.create({ prefix: prefixUrl });
  const get = <T>(path: string) =>
    Effect.tryPromise({
      try: (signal) => http.get(path, { signal }).json<T>(),
      catch: toError,
    }).pipe(withTimeout, Effect.retry(RETRY_READS));
  return {
    listPapers: () => get<ExamPaper[]>("exams"),
    listPapersPage: (page) => get<ExamPaper[]>(`exams?page=${page}`),
    getExam: (examId) =>
      get<ExamDetail>(`exams/${examId}`).pipe(
        Effect.catchIf(
          (error) => error instanceof HTTPError && error.response.status === 404,
          () => Effect.succeed(null),
        ),
      ),
  };
};
