import * as WebBrowser from "expo-web-browser";

import { API_BASE_URL } from "@/shared/config";

import type { TokenPayload } from "@hanjang/api";

export type KakaoSignInResult =
  | { status: "ok"; tokens: TokenPayload }
  | { status: "cancel" };

const KAKAO_AUTH_URL = `${API_BASE_URL}/auth/kakao?client=mobile`;
const KAKAO_REDIRECT = "hanjang://auth/kakao";

const parseTokens = (url: string): TokenPayload | null => {
  const query = url.split("?")[1] ?? "";
  const params = new URLSearchParams(query);
  const accessToken = params.get("access");
  const refreshToken = params.get("refresh");
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};

export const signInWithKakao = async (): Promise<KakaoSignInResult> => {
  const result = await WebBrowser.openAuthSessionAsync(
    KAKAO_AUTH_URL,
    KAKAO_REDIRECT,
  );
  if (result.type !== "success") return { status: "cancel" };
  const tokens = parseTokens(result.url);
  if (!tokens) throw new Error("kakao-callback-missing-tokens");
  return { status: "ok", tokens };
};
