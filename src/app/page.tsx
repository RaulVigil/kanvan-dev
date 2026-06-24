import { getBoards } from "@/app/boards/[boardId]/actions";
import { NewBoardForm } from "@/components/board/new-board-form";
import Link from "next/link";

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-6">
        <img src="/logo.png" alt="Kanvan dev" className="h-28 w-auto" />
        <p className="text-sm text-muted -mt-2">Tus tableros de colaboración</p>
      </div>

      {/* New board form */}
      <NewBoardForm />

      {/* Boards list */}
      {boards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/20 bg-surface/10 py-16">
          <p className="text-sm text-muted">No hay tableros todavía</p>
          <p className="text-xs text-muted/60">Creá uno para empezar</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group rounded-xl border border-surface/40 bg-surface/15 px-5 py-4 transition-colors hover:border-glow/30 hover:bg-surface/30"
            >
              <h2 className="text-sm font-medium text-light transition-colors group-hover:text-glow">
                {board.title}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {new Date(board.createdAt).toLocaleDateString("es")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
