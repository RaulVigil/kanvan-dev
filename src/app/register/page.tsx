import { signUp } from "@/app/auth/actions";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthForm } from "@/components/ui/auth-form";

export default function RegisterPage() {
  return (
    <div className="geo-gradient relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Animated geometric shapes */}
      <div className="geo-shape bg-glow/20 h-[500px] w-[500px] rounded-full -top-[10%] -left-[10%]" />
      <div
        className="geo-shape bg-accent/20 h-[400px] w-[400px] rounded-full -bottom-[5%] -right-[5%]"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="geo-shape bg-subtle/15 h-[300px] w-[300px] rounded-full top-[20%] right-[10%]"
        style={{ animationDelay: "-10s" }}
      />

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="glass-card rounded-2xl px-8 py-10 shadow-[0_0_80px_rgba(123,189,232,0.06)]">
          {/* Header */}
          <header className="mb-10 flex flex-col items-center">
            <div className="mb-6 h-20 w-20">
              <img
                src="/logo.png"
                alt="Kanvan Dev"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-light">
              Crear cuenta
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Empezá a organizar tus proyectos
            </p>
          </header>

          {/* Form */}
          <AuthForm action={signUp}>
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle"
              >
                Nombre
              </label>
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Raúl"
                  className="input-glow w-full rounded-xl border border-surface/30 bg-deep/60 py-3 pl-12 pr-4 text-sm text-light placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-glow/40 focus:bg-deep"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle"
              >
                Email
              </label>
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="raul@ejemplo.com"
                  className="input-glow w-full rounded-xl border border-surface/30 bg-deep/60 py-3 pl-12 pr-4 text-sm text-light placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-glow/40 focus:bg-deep"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle"
              >
                Contraseña
              </label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-glow/25 py-3.5 text-[15px] font-semibold tracking-tight text-glow shadow-[0_0_24px_rgba(123,189,232,0.12)] transition-all duration-300 hover:bg-glow/35 active:scale-[0.98]"
            >
              Crear cuenta
            </button>
          </AuthForm>

          {/* Footer */}
          <footer className="mt-8 border-t border-surface/10 pt-6 text-center">
            <p className="text-sm text-muted">
              ¿Ya tenés cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-glow transition-colors hover:text-light"
              >
                Iniciar sesión
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}


