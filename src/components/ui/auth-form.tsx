"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";

interface AuthFormProps {
  action: (formData: FormData) => Promise<{ error?: string; redirect?: string }>;
  children: ReactNode;
}

export function AuthForm({ action, children }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.redirect) {
        router.push(result.redirect);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {children}
      <noscript>
        <button type="submit" className="hidden" />
      </noscript>
    </form>
  );
}
