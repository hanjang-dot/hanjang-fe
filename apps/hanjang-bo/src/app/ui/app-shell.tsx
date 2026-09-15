"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAdminSession } from "@/shared/auth/admin-session";
import { ROUTES } from "@/shared/config/constants";

import type { ReactNode } from "react";

const AppShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const token = useAdminSession((state) => state.token);
  const signOut = useAdminSession((state) => state.signOut);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace(ROUTES.login);
    }
  }, [mounted, token, router]);

  const onSignOut = () => {
    signOut();
    router.replace(ROUTES.login);
  };

  if (!mounted || !token) {
    return null;
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header-inner">
          <Link href={ROUTES.exams} className="shell-brand">
            한장 BO
          </Link>
          <nav className="shell-nav">
            <Link href={ROUTES.exams}>시험지</Link>
            <Link href={ROUTES.quizzes}>퀴즈</Link>
            <Link href={ROUTES.adminInvite}>관리자 초대</Link>
          </nav>
          <button type="button" className="button button-secondary button-sm" onClick={onSignOut}>
            로그아웃
          </button>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};

export default AppShell;
