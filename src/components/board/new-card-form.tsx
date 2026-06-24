"use client";

import { useState, useRef, useEffect } from "react";

interface NewCardFormProps {
  listId: string;
  onSubmit: (title: string, startDate?: string, dueDate?: string) => Promise<void>;
}

export function NewCardForm({ onSubmit }: NewCardFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-surface/30 hover:text-subtle"
      >
        <span className="text-base leading-none">+</span>
        Agregar tarjeta
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-1.5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        await onSubmit(title.trim(), startDate || undefined, dueDate || undefined);
        setTitle("");
        setStartDate("");
        setDueDate("");
        setLoading(false);
        setOpen(false);
      }}
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la tarjeta…"
        className="h-8 rounded-md border border-surface bg-deep px-2.5 text-xs text-light placeholder:text-muted/50 outline-none focus:border-glow/40"
      />
      <div className="flex gap-1.5">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-7 flex-1 rounded-md border border-surface bg-deep px-2 text-[11px] text-light outline-none focus:border-glow/40 [color-scheme:dark]"
          title="Fecha de inicio"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-7 flex-1 rounded-md border border-surface bg-deep px-2 text-[11px] text-light outline-none focus:border-glow/40 [color-scheme:dark]"
          title="Fecha límite"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="h-7 rounded-md bg-glow/20 px-2.5 text-[11px] font-medium text-glow transition-colors hover:bg-glow/30 disabled:opacity-40"
        >
          {loading ? "…" : "Crear"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTitle("");
            setStartDate("");
            setDueDate("");
          }}
          className="text-[11px] text-muted hover:text-light transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
