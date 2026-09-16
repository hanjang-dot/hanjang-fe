import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import AppShell from "@/app/ui/app-shell";
import TokenStyle from "@/app/ui/token-style";
import AdminInvitePage from "@/pages/admin-invite";
import ExamCreatePage from "@/pages/exam-create";
import ExamDetailPage from "@/pages/exam-detail";
import ExamListPage from "@/pages/exam-list";
import InviteAcceptPage from "@/pages/invite-accept";
import LoginPage from "@/pages/login";
import QuizManagePage from "@/pages/quiz-manage";
import { ROUTES } from "@/shared/config/constants";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TokenStyle />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: ROUTES.exams });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const InviteAcceptRoute = () => {
  const { token } = inviteAcceptRoute.useParams();
  return <InviteAcceptPage token={token} />;
};

const inviteAcceptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invite/$token",
  component: InviteAcceptRoute,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: AppShell,
});

const examsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/exams",
  component: ExamListPage,
});

const examNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/exams/new",
  component: ExamCreatePage,
});

const ExamDetailRoute = () => {
  const { examId } = examDetailRoute.useParams();
  return <ExamDetailPage examId={examId} />;
};

const examDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/exams/$examId",
  component: ExamDetailRoute,
});

const quizzesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/quizzes",
  component: QuizManagePage,
});

const adminInviteRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admins/invite",
  component: AdminInvitePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  inviteAcceptRoute,
  adminRoute.addChildren([
    examsRoute,
    examNewRoute,
    examDetailRoute,
    quizzesRoute,
    adminInviteRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
