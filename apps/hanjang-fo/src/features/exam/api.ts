import { Effect } from "effect";

import { API_BASE_URL } from "@/shared/config";

import { createRemoteExamClient } from "./exam-client";
import { createMockExamClient } from "./mock-exam-client";

import type { ExamClient } from "./exam-client";

const examClient: ExamClient = API_BASE_URL
  ? createRemoteExamClient()
  : createMockExamClient();

export const fetchExamPapers = () =>
  Effect.runPromise(examClient.listPapers());

export const fetchExamPapersPage = (pageIndex: number) =>
  Effect.runPromise(examClient.listPapersPage(pageIndex));

export const fetchExam = (examId: string) =>
  Effect.runPromise(examClient.getExam(examId));
