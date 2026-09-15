import { Effect, Schedule } from "effect";

export const REQUEST_TIMEOUT = "5 seconds";

export const withTimeout = <A, E, R>(self: Effect.Effect<A, E, R>) =>
  self.pipe(Effect.timeout(REQUEST_TIMEOUT));

export const RETRY_READS = Schedule.exponential("200 millis").pipe(
  Schedule.compose(Schedule.recurs(2)),
);

export const RETRY_WRITES = Schedule.exponential("100 millis").pipe(
  Schedule.compose(Schedule.recurs(1)),
);

export const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));
