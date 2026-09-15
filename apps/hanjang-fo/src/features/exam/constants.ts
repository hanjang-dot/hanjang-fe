export const EXAM_PAPERS_QUERY_KEY = ["exam-papers"] as const;

export const examQueryKey = (examId: string) => ["exam", examId] as const;

export const MOCK_LATENCY_MS = 150;
