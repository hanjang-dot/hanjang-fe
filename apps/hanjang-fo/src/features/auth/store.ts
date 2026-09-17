import AsyncStorage from "@react-native-async-storage/async-storage";
import { Effect } from "effect";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  hanjangApi,
  setApiAccessToken,
  setApiDeviceId,
  setApiRefreshHandler,
  setApiUnauthorizedHandler,
} from "@/shared/api-client";

import { signInWithKakao } from "./kakao";

import type { TokenPayload } from "@hanjang/api";

import type { User } from "./types";

const ACCESS_TOKEN_KEY = "hanjang_access_token";
const REFRESH_TOKEN_KEY = "hanjang_refresh_token";

const SIGN_IN_ERROR = "로그인하지 못했어요 다시 시도할 수 있어요";

const mintDeviceId = () =>
  `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const decodeUserId = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      globalThis.atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { userId?: string };
    return decoded.userId ?? "";
  } catch {
    return "";
  }
};

const saveTokens = (tokens: TokenPayload | null) => {
  if (tokens) {
    void SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    void SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    return;
  }
  void SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  void SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export type KakaoSignInStatus = "ok" | "cancel";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string;
  signingIn: boolean;
  error: string | null;
  signInKakao: () => Promise<KakaoSignInStatus>;
  signInWithTokens: (tokens: TokenPayload) => void;
  signOut: () => void;
}

const applyTokens = (
  set: (partial: Partial<AuthState>) => void,
  tokens: TokenPayload,
) => {
  setApiAccessToken(tokens.accessToken);
  saveTokens(tokens);
  set({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      userId: decodeUserId(tokens.accessToken),
      name: "수험생",
      provider: "kakao",
    },
    signingIn: false,
    error: null,
  });
  if (hanjangApi) {
    void Effect.runPromise(hanjangApi.auth.me())
      .then((me) => {
        const user = useAuthStore.getState().user;
        if (user) useAuthStore.setState({ user: { ...user, email: me.email } });
      })
      .catch(() => undefined);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      deviceId: mintDeviceId(),
      signingIn: false,
      error: null,
      signInKakao: async () => {
        set({ signingIn: true, error: null });
        try {
          const result = await signInWithKakao();
          if (result.status === "cancel") {
            set({ signingIn: false });
            return "cancel";
          }
          applyTokens(set, result.tokens);
          return "ok";
        } catch (error) {
          set({ signingIn: false, error: SIGN_IN_ERROR });
          throw error;
        }
      },
      signInWithTokens: (tokens) => {
        applyTokens(set, tokens);
      },
      signOut: () => {
        const refreshToken = get().refreshToken;
        if (hanjangApi && refreshToken) {
          void Effect.runPromise(
            hanjangApi.auth.logout(refreshToken),
          ).catch(() => undefined);
        }
        setApiAccessToken(null);
        saveTokens(null);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },
    }),
    {
      name: "hanjang-fo-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        deviceId: state.deviceId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.deviceId) setApiDeviceId(state.deviceId);
      },
    },
  ),
);

setApiDeviceId(useAuthStore.getState().deviceId);

void (async () => {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  if (accessToken && refreshToken) {
    setApiAccessToken(accessToken);
    useAuthStore.setState({ accessToken, refreshToken });
    return;
  }
  if (useAuthStore.getState().user) {
    useAuthStore.getState().signOut();
  }
})();

setApiRefreshHandler(async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!hanjangApi || !refreshToken) throw new Error("no refresh token");
  const tokens = await Effect.runPromise(
    hanjangApi.auth.refresh(refreshToken),
  );
  setApiAccessToken(tokens.accessToken);
  saveTokens(tokens);
  useAuthStore.setState({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
  return tokens;
});
setApiUnauthorizedHandler(() => useAuthStore.getState().signOut());
