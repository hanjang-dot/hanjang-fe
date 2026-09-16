import AppShell from "@/app/ui/app-shell";

import type { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => <AppShell>{children}</AppShell>;

export default AdminLayout;
