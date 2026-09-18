import { createHanjangApi } from "@hanjang/api";

import { API_BASE_URL } from "./config";
import { instrument } from "./instrumentation";

import type { TokenPayload } from "@hanjang/api";

let accessToken: string | null = null;
let deviceId: string | null = null;
let refreshHandler: (() => Promise<TokenPayload>) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setApiDeviceId = (id: string | null) => {
  deviceId = id;
};

export const setApiRefreshHandler = (
  handler: (() => Promise<TokenPayload>) | null,
) => {
  refreshHandler = handler;
};

export const setApiUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export const hanjangApi = API_BASE_URL
  ? createHanjangApi({
      baseUrl: API_BASE_URL,
      getAccessToken: () => accessToken,
      getDeviceId: () => deviceId,
      getTestHeaders: (): Record<string, string> =>
        instrument.gradeDelayMs > 0
          ? { "x-test-delay": String(instrument.gradeDelayMs) }
          : {},
      refreshTokens: () => {
        if (!refreshHandler) return Promise.reject(new Error("no refresh handler"));
        return refreshHandler();
      },
      onUnauthorized: () => unauthorizedHandler?.(),
    })
  : null;
