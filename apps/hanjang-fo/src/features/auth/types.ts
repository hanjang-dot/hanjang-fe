export type AuthProvider = "kakao" | "phone";

export interface User {
  userId: string;
  name: string;
  provider: AuthProvider;
}
