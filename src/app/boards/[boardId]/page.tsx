import { notFound } from "next/navigation";
import { getBoardWithListsAndCards } from "./actions";
import { KanbanBoard } from "@/components/board/kanban-board";
import Link from "next/link";

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  const board = await getBoardWithListsAndCards(boardId);
  if (!board) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <KanbanBoard board={board} />
      <div className="border-t border-surface/50 px-6 py-3">
        <Link
          href="/"
          className="text-xs text-muted transition-colors hover:text-light"
        >
          ← Volver a tableros
        </Link>
      </div>
    </div>
  );
}
