import { Effect, Schedule } from "effect";
import ky, { HTTPError } from "ky";

import type {
  CompleteKakaoPhoneSignupInput,
  CompletePhoneSignupInput,
  ExamPaperPayload,
  ExamSessionDetailPayload,
  ExamSessionPayload,
  GradeAnswerInput,
  GradeQuizAnswerInput,
  GradeResultPayload,
  MePayload,
  QuestionPayload,
  QuizPayload,
  QuizSessionPayload,
  RequestPhoneCodeInput,
  SaveAnswerInput,
  SaveStrokeDraftInput,
  StartExamSessionInput,
  StartQuizSessionInput,
  TokenPayload,
  VerifyPhoneCodeInput,
  VerifyPhoneCodePayload,
} from "./types";

const REQUEST_TIMEOUT = "5 seconds";

const RETRY_READS = Schedule.exponential("200 millis").pipe(
  Schedule.compose(Schedule.recurs(2)),
);

const RETRY_WRITES = Schedule.exponential("100 millis").pipe(
  Schedule.compose(Schedule.recurs(1)),
);

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

const isUnauthorized = (error: unknown): error is HTTPError =>
  error instanceof HTTPError && error.response.status === 401;

const isNotFound = (error: unknown): error is HTTPError =>
  error instanceof HTTPError && error.response.status === 404;

export const isNotFoundError = isNotFound;
export const isUnauthorizedError = isUnauthorized;

export interface HanjangApiOptions {
  baseUrl: string;
  getAccessToken?: () => string | null;
  getDeviceId?: () => string | null;
  getTestHeaders?: () => Record<string, string>;
  refreshTokens?: () => Promise<TokenPayload>;
  onUnauthorized?: () => void;
}

export const createHanjangApi = (options: HanjangApiOptions) => {
  const http = ky.create({
    prefix: options.baseUrl.replace(/\/?$/, "/"),
    hooks: {
      beforeRequest: [
        (state) => {
          const token = options.getAccessToken?.();
          if (token)
            state.request.headers.set("Authorization", `Bearer ${token}`);
          const deviceId = options.getDeviceId?.();
          if (deviceId) state.request.headers.set("x-device-id", deviceId);
          for (const [key, value] of Object.entries(
            options.getTestHeaders?.() ?? {},
          )) {
            state.request.headers.set(key, value);
          }
        },
      ],
    },
  });

  const call = <T>(fn: (signal: AbortSignal) => Promise<T>, write = false) =>
    Effect.tryPromise({ try: (signal) => fn(signal), catch: toError }).pipe(
      Effect.timeout(REQUEST_TIMEOUT),
      Effect.retry(write ? RETRY_WRITES : RETRY_READS),
    );

  const guarded = <T>(
    make: () => Effect.Effect<T, Error>,
  ): Effect.Effect<T, Error> =>
    Effect.suspend(make).pipe(
      Effect.catchIf(isUnauthorized, () =>
        Effect.suspend((): Effect.Effect<T, Error> => {
          if (!options.refreshTokens) {
            options.onUnauthorized?.();
            return Effect.fail(new Error("unauthorized"));
          }
          return Effect.tryPromise({
            try: () => options.refreshTokens!(),
            catch: toError,
          }).pipe(
            Effect.andThen(make()),
            Effect.catchAll((error) => {
              options.onUnauthorized?.();
              return Effect.fail(error);
            }),
          );
        }),
      ),
    );

  const get = <T>(path: string) =>
    guarded(() => call((signal) => http.get(path, { signal }).json<T>()));

  const getMaybe = <T>(path: string) =>
    get<T>(path).pipe(Effect.catchIf(isNotFound, () => Effect.succeed(null)));

  const post = <T>(path: string, json?: unknown) =>
    guarded(() =>
      call(
        (signal) => http.post(path, { json, signal }).json<T>(),
        true,
      ),
    );

  const patch = <T>(path: string, json: unknown) =>
    guarded(() =>
      call(
        (signal) => http.patch(path, { json, signal }).json<T>(),
        true,
      ),
    );

  return {
    auth: {
      requestPhoneCode: (input: RequestPhoneCodeInput) =>
        post<{ ok: boolean }>("phone/code", input),
      verifyPhoneCode: (input: VerifyPhoneCodeInput) =>
        post<VerifyPhoneCodePayload>("phone/verify", input),
      completePhoneSignup: (input: CompletePhoneSignupInput) =>
        post<TokenPayload>("phone/signup", input),
      completeKakaoPhoneSignup: (input: CompleteKakaoPhoneSignupInput) =>
        post<TokenPayload>("phone/kakao-signup", input),
      signin: (input: { email: string; password: string; phoneVerificationToken: string }) =>
        post<TokenPayload>("auth/signin", input),
      refresh: (refreshToken: string) =>
        call((signal) =>
          http
            .post("auth/refresh", {
              headers: { Cookie: `refresh_token=${refreshToken}` },
              signal,
            })
            .json<TokenPayload>(),
          true,
        ),
      logout: (refreshToken: string) =>
        call((signal) =>
          http
            .post("auth/logout", {
              headers: { Cookie: `refresh_token=${refreshToken}` },
              signal,
            })
            .then(() => undefined),
          true,
        ),
      me: () => get<MePayload>("users/me"),
    },
    exams: {
      list: () => get<ExamPaperPayload[]>("exams"),
      detail: (examPaperId: string) => get<ExamPaperPayload>(`exams/${examPaperId}`),
      questions: (examPaperId: string) =>
        get<QuestionPayload[]>(`exams/${examPaperId}/questions`),
    },
    quizzes: {
      list: () => get<QuizPayload[]>("quizzes"),
      today: () => get<QuizPayload[]>("quizzes/today"),
    },
    quizSessions: {
      start: (input: StartQuizSessionInput) =>
        post<QuizSessionPayload>("quiz-sessions", input),
      submit: (quizSessionId: string) =>
        post<QuizSessionPayload>(`quiz-sessions/${quizSessionId}/submit`),
    },
    sessions: {
      start: (input: StartExamSessionInput) => post<ExamSessionPayload>("sessions", input),
      list: () => get<ExamSessionPayload[]>("sessions"),
      ongoing: (examPaperId: string) =>
        get<ExamSessionPayload | null>(`sessions/ongoing?examPaperId=${examPaperId}`).pipe(
          Effect.catchAll(() => Effect.succeed(null)),
        ),
      detail: (examSessionId: string) =>
        getMaybe<ExamSessionDetailPayload>(`sessions/${examSessionId}`),
      saveAnswer: (examSessionId: string, input: SaveAnswerInput) =>
        patch(`sessions/${examSessionId}/answers`, input),
      saveStroke: (examSessionId: string, input: SaveStrokeDraftInput) =>
        post(`sessions/${examSessionId}/strokes`, input),
      submit: (examSessionId: string) =>
        post<ExamSessionPayload>(`sessions/${examSessionId}/submit`),
      abort: (examSessionId: string) =>
        post<ExamSessionPayload>(`sessions/${examSessionId}/abort`),
    },
    grade: {
      answer: (input: GradeAnswerInput) => post<GradeResultPayload>("grade", input),
      quiz: (input: GradeQuizAnswerInput) =>
        post<GradeResultPayload>("grade/quiz", input),
    },
  };
};

export type HanjangApi = ReturnType<typeof createHanjangApi>;
