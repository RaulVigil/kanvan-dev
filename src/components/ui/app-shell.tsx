"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return <>{children}</>;

  return (
    <>
      <UserMenu />
      {children}
    </>
  );
}
