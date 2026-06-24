"use client";

import { useRef } from "react";

export function PasswordInput({
  id,
  name,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  name: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <input
        ref={ref}
        id={id}
        name={name}
        type="password"
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        className="input-glow peer w-full rounded-xl border border-surface/30 bg-deep/60 py-3 pl-12 pr-12 text-sm text-light placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-glow/40 focus:bg-deep"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 transition-colors hover:text-muted"
        tabIndex={-1}
        onClick={() => {
          if (ref.current) {
            ref.current.type =
              ref.current.type === "password" ? "text" : "password";
          }
        }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}
