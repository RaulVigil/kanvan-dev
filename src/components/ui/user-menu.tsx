"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { getUserPlan } from "@/app/boards/[boardId]/actions";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    name: string | null;
    plan: "FREE" | "PREMIUM";
  } | null>(null);

  useEffect(() => {
    getUserPlan().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-surface/30 px-6 py-2.5">
      <Link
        href="/"
        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <img src="/logo.png" alt="Kanvan dev" className="h-6 w-auto" />
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
              user.plan === "PREMIUM"
                ? "bg-glow/20 text-glow"
                : "bg-muted/15 text-muted"
            }`}
          >
            {user.plan === "PREMIUM" ? "💎 Premium" : "Free"}
          </span>

          <span className="text-xs text-muted">{user.email}</span>

          <button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="text-xs text-muted transition-colors hover:text-light"
          >
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
