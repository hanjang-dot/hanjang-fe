import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";

import { useAdminSession } from "@/shared/auth/admin-session";
import { ROUTES } from "@/shared/config/constants";

const AppShell = () => {
  const navigate = useNavigate();
  const token = useAdminSession((state) => state.token);
  const signOut = useAdminSession((state) => state.signOut);

  useEffect(() => {
    if (!token) {
      navigate({ to: ROUTES.login, replace: true });
    }
  }, [token, navigate]);

  const onSignOut = () => {
    signOut();
    navigate({ to: ROUTES.login, replace: true });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header-inner">
          <Link to={ROUTES.exams} className="shell-brand">
            한장 BO
          </Link>
          <nav className="shell-nav">
            <Link to={ROUTES.exams}>시험지</Link>
            <Link to={ROUTES.quizzes}>퀴즈</Link>
            <Link to={ROUTES.adminInvite}>관리자 초대</Link>
          </nav>
          <button type="button" className="button button-secondary button-sm" onClick={onSignOut}>
            로그아웃
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
