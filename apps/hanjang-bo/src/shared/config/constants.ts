export const ROUTES = {
  login: "/login",
  exams: "/exams",
  examNew: "/exams/new",
  examDetail: (examId: string) => `/exams/${examId}`,
  quizzes: "/quizzes",
  adminInvite: "/admins/invite",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const API_TIMEOUT_MS = 5000;

export const API_RETRY_DELAY_MS = 100;

export const API_RETRY_COUNT = 2;
