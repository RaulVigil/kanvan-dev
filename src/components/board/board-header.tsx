interface BoardHeaderProps {
  title: string;
}

export function BoardHeader({ title }: BoardHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-semibold text-light tracking-tight">
        {title}
      </h1>
      <span className="text-xs text-muted">
        {new Date().toLocaleDateString("es", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
  );
}
