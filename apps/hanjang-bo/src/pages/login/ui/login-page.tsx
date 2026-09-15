"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/shared/config/constants";

import { useAdminLogin } from "../api/admin-auth";

import type { FormEvent } from "react";

const LoginPage = () => {
  const router = useRouter();
  const login = useAdminLogin();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = adminId.trim().length > 0 && password.length > 0 && !login.isPending;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    login.mutate(
      { id: adminId.trim(), password },
      { onSuccess: () => router.replace(ROUTES.exams) },
    );
  };

  return (
    <div className="container-narrow">
      <h1>한장 BO 로그인</h1>
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="admin-id">
            아이디
          </label>
          <input
            id="admin-id"
            className="input"
            value={adminId}
            onChange={(event) => setAdminId(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="admin-password">
            비밀번호
          </label>
          <input
            id="admin-password"
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>
        {login.isError && <p className="error-text">{login.error.message}</p>}
        <button type="submit" className="button" disabled={!canSubmit}>
          {login.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
