"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GlowButton } from "@/components/ui/glow-button";
import { GlowInput } from "@/components/ui/glow-input";
import { createBoard } from "@/app/boards/[boardId]/actions";

export function NewBoardForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    startTransition(async () => {
      const result = await createBoard(title.trim());
      if (result?.error) {
        setError(result.error);
      }
      // If no error, redirect happens server-side
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <GlowInput name="title" placeholder="Nombre del tablero…" required />
        </div>
        <GlowButton type="submit" disabled={isPending}>
          {isPending ? "Creando…" : "Crear tablero"}
        </GlowButton>
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-glow/20 bg-glow/5 px-4 py-3">
          <p className="text-sm text-glow">{error}</p>
        </div>
      )}
    </form>
  );
}
