import { hanjangApi } from "@/shared/api-client";

import { GRADE_LATENCY_MS } from "./constants";
import { createRemoteGradeClient } from "./grade-client";
import { createMockGradeClient } from "./mock-grade-client";
import { createRemoteSessionClient } from "./session-client";

import type { GradeClient } from "./types";

export const gradeClient: GradeClient = hanjangApi
  ? createRemoteGradeClient()
  : createMockGradeClient({ latencyMs: GRADE_LATENCY_MS });

export const sessionClient = hanjangApi
  ? createRemoteSessionClient()
  : null;
