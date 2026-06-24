# 🗂️ Kanvan Dev

Plataforma de colaboración en equipo tipo Trello con kanban, Gantt y autenticación. Construida con **Next.js 16 + Prisma v7 + Supabase**.

<p align="center">
  <img src="public/logo.png" alt="Kanvan Dev" width="180" />
</p>

---

## ✨ Features

| Feature | Descripción |
|---|---|
| 📋 **Kanban** | Tableros con columnas y tarjetas drag & drop |
| 📅 **Gantt** | Vista de timeline semanal con barras por columna |
| 🔐 **Auth** | Registro, login y logout con Supabase Auth |
| 💎 **Planes** | Free (1 board) / Premium (ilimitado) |
| 🛑 **Rate limit** | Máximo 2 registros por día |
| 👁️ **Password toggle** | Mostrar/ocultar contraseña en inputs |
| 🎨 **Dark theme** | Paleta personalizada con glass morphism y glow |
| 📱 **Responsive** | Adaptable a móvil y escritorio |
| 🗄️ **PostgreSQL** | Supabase (us-east-2) con Prisma v7.8.0 |

---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router + Server Actions) |
| **Estilos** | Tailwind CSS v4 |
| **ORM** | Prisma v7.8.0 |
| **BD** | Supabase PostgreSQL |
| **Auth** | Supabase Auth + `@supabase/ssr` |
| **Drag & drop** | `@dnd-kit/core` + `@dnd-kit/sortable` |
| **Lenguaje** | TypeScript 5 |
| **Package manager** | pnpm |

---

## 🎨 Paleta

```
#001D39  ████  deep      → fondo, body
#0A4174  ████  surface   → tarjetas, inputs
#49769F  ████  muted     → texto secundario
#4E8EA2  ████  accent    → badges, chips
#6EA2B3  ████  subtle    → labels, hover
#7BBDE8  ████  glow      → focus, botones, drag
#BDD8E9  ████  light     → texto principal
```

---

## 🚀 Setup

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd kanban-dev
pnpm install
```

### 2. Variables de entorno

Crear `.env`:

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
```

### 3. Migrar base de datos

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Supabase Auth

- **Authentication → Sign In / Providers** → desmarcar _"Confirm email"_
- **SQL Editor** → ejecutar `prisma/trigger.sql` (opcional, el código hace upsert)

### 5. Dev server

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura

```
src/
  app/
    auth/actions.ts                  → signUp, signIn, signOut
    login/page.tsx                   → página de login
    register/page.tsx                → página de registro
    page.tsx                         → home (lista de boards)
    boards/[boardId]/
      page.tsx                       → vista kanban
      actions.ts                     → CRUD boards, lists, cards
  components/
    board/
      board-header.tsx               → título + fecha
      card-item.tsx                  → tarjeta individual
      gantt-view.tsx                 → timeline semanal
      kanban-board.tsx               → toggle kanban/gantt
      list-column.tsx                → columna droppable
      new-board-form.tsx             → formulario crear board
      new-card-form.tsx              → formulario crear card
      new-list-form.tsx              → formulario crear lista
      sortable-card.tsx              → wrapper @dnd-kit
    ui/
      app-shell.tsx                  → layout wrapper
      auth-form.tsx                  → form client-side con errores
      glow-button.tsx                → botón con efecto glow
      glow-input.tsx                 → input estilizado
      password-input.tsx             → input con toggle visibilidad
      user-menu.tsx                  → navbar: plan, email, logout
  lib/
    prisma.ts                        → singleton PrismaClient
    dnd/types.ts                     → tipos KanbanColumn, KanbanItem
    dnd/sortable-context.tsx         → contexto @dnd-kit
    supabase/server.ts               → cliente server-side
    supabase/client.ts               → cliente browser
    supabase/middleware.ts            → refresh de sesión
  middleware.ts                       → proxy de cookies
prisma/
  schema.prisma                      → modelos Board, List, Card, User
```

---

## 🔄 Modelos

```
User ──< Board ──< List ──< Card
```

| Modelo | Campos clave |
|---|---|
| **User** | `id`, `email`, `name?`, `plan` (FREE\|PREMIUM) |
| **Board** | `id`, `title`, `userId` |
| **List** | `id`, `title`, `position`, `boardId` |
| **Card** | `id`, `title`, `description?`, `startDate?`, `dueDate?`, `position`, `listId` |

---

## 🔒 Planes

| | Free | Premium |
|---|---|---|
| Boards | 1 | Ilimitado |
| Lists por board | Ilimitado | Ilimitado |
| Cards por lista | Ilimitado | Ilimitado |

Para cambiar un usuario a Premium:

```sql
UPDATE "User" SET plan = 'PREMIUM' WHERE email = 'usuario@email.com';
```

---

## 📝 Licencia

MIT

