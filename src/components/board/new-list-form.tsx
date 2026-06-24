"use client";

import { useState, useRef, useEffect } from "react";
import { GlowButton } from "@/components/ui/glow-button";

interface NewListFormProps {
  onSubmit: (title: string) => Promise<void>;
}

export function NewListForm({ onSubmit }: NewListFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-72 shrink-0 items-center gap-2 rounded-xl border border-dashed border-muted/30 px-4 text-sm text-muted transition-colors hover:border-glow/30 hover:text-glow"
      >
        <span className="text-lg leading-none">+</span>
        Agregar lista
      </button>
    );
  }

  return (
    <form
      className="flex w-72 shrink-0 flex-col gap-2 rounded-xl border border-glow/20 bg-surface/40 p-3 shadow-[0_0_12px_rgba(123,189,232,0.06)]"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        await onSubmit(title.trim());
        setTitle("");
        setLoading(false);
        setOpen(false);
      }}
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la lista..."
        className="h-8 rounded-md border border-surface bg-deep px-2.5 text-sm text-light placeholder:text-muted/50 outline-none focus:border-glow/40"
      />
      <div className="flex items-center gap-2">
        <GlowButton type="submit" size="sm" disabled={loading || !title.trim()}>
          {loading ? "Creando…" : "Crear"}
        </GlowButton>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTitle("");
          }}
          className="text-xs text-muted hover:text-light transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
