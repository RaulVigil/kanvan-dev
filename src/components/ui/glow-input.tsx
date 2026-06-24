import type { InputHTMLAttributes } from "react";

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function GlowInput({
  label,
  className = "",
  id,
  ...props
}: GlowInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-muted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-9 rounded-lg border border-surface bg-deep px-3 text-sm text-light placeholder:text-muted/60 transition-colors focus:outline-none focus:border-glow/50 focus:shadow-[0_0_10px_rgba(123,189,232,0.10)] ${className}`}
        {...props}
      />
    </div>
  );
}
