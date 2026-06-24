import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
}

export function GlowButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: GlowButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/60 disabled:opacity-40 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
  };

  const variants = {
    primary:
      "bg-glow/15 text-glow hover:bg-glow/25 shadow-[0_0_12px_rgba(123,189,232,0.15)] hover:shadow-[0_0_18px_rgba(123,189,232,0.25)]",
    ghost:
      "text-muted hover:text-light hover:bg-surface/60",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
