import { API_BASE_URL } from "@/shared/config";

import { GRADE_LATENCY_MS } from "./constants";
import { createKyGradeClient } from "./grade-client";
import { createMockGradeClient } from "./mock-grade-client";
import { createKySessionClient } from "./session-client";

import type { GradeClient } from "./types";

export const gradeClient: GradeClient = API_BASE_URL
  ? createKyGradeClient(API_BASE_URL)
  : createMockGradeClient({ latencyMs: GRADE_LATENCY_MS });

export const sessionClient = API_BASE_URL
  ? createKySessionClient(API_BASE_URL)
  : null;
