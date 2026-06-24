"use client";

interface CardItemProps {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export function CardItem({ title, description, dueDate }: CardItemProps) {
  const formatted = dueDate
    ? new Date(dueDate).toLocaleDateString("es", {
        day: "numeric",
        month: "short",
      })
    : null;

  const isPast = dueDate ? new Date(dueDate) < new Date() : false;

  return (
    <div className="group cursor-grab rounded-lg border border-surface/60 bg-surface/30 px-3 py-2.5 shadow-sm transition-colors hover:border-glow/30 active:cursor-grabbing">
      <p className="text-sm font-medium text-light leading-snug">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted line-clamp-2">{description}</p>
      )}
      {formatted && (
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isPast
              ? "bg-red-500/15 text-red-400"
              : "bg-glow/15 text-glow"
          }`}
        >
          {isPast ? "⏰ " : "📅 "}
          {formatted}
        </span>
      )}
    </div>
  );
}
