import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { ROUTES } from "@/shared/config/constants";

import { useAcceptAdminInvite } from "../api/accept-admin-invite";

import type { FormEvent } from "react";

const InviteAcceptPage = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const accept = useAcceptAdminInvite();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [localError, setLocalError] = useState("");

  const canSubmit =
    adminId.trim().length > 0 && password.length > 0 && !accept.isPending;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setLocalError("비밀번호가 다르다.");
      return;
    }
    setLocalError("");
    accept.mutate(
      { token, loginId: adminId.trim(), password },
      { onSuccess: () => navigate({ to: ROUTES.login, replace: true }) },
    );
  };

  return (
    <div className="container-narrow">
      <h1>관리자 계정 만들기</h1>
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="invite-id">
            아이디
          </label>
          <input
            id="invite-id"
            className="input"
            value={adminId}
            onChange={(event) => setAdminId(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="invite-password">
            비밀번호
          </label>
          <input
            id="invite-password"
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="invite-password-confirm">
            비밀번호 확인
          </label>
          <input
            id="invite-password-confirm"
            className="input"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        {(localError || accept.isError) && (
          <p className="error-text">{localError || accept.error?.message}</p>
        )}
        <button type="submit" className="button" disabled={!canSubmit}>
          계정 생성
        </button>
      </form>
    </div>
  );
};

export default InviteAcceptPage;
