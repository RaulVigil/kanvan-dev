"use client";

import { useCallback, useState } from "react";
import { BoardHeader } from "@/components/board/board-header";
import { ListColumn } from "@/components/board/list-column";
import { NewListForm } from "@/components/board/new-list-form";
import { GanttView } from "@/components/board/gantt-view";
import { KanbanProvider, useKanban } from "@/lib/dnd/sortable-context";
import type { KanbanColumn, KanbanMoveEvent } from "@/lib/dnd/types";
import {
  createList,
  createCard,
  moveCard,
} from "@/app/boards/[boardId]/actions";
import type { Board, List, Card } from "@prisma/client";

type BoardWithLists = Board & { lists: (List & { cards: Card[] })[] };

type ViewMode = "kanban" | "gantt";

interface KanbanBoardProps {
  board: BoardWithLists;
}

export function KanbanBoard({ board }: KanbanBoardProps) {
  const [view, setView] = useState<ViewMode>("kanban");

  const columns: KanbanColumn[] = board.lists.map((list) => ({
    id: list.id,
    title: list.title,
    items: list.cards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      startDate: card.startDate?.toISOString() ?? null,
      dueDate: card.dueDate?.toISOString() ?? null,
    })),
  }));

  const handleMove = useCallback(
    async (event: KanbanMoveEvent) => {
      await moveCard(
        String(event.activeId),
        String(event.targetColumnId),
        board.id,
      );
    },
    [board.id],
  );

  const handleCreateList = useCallback(
    async (title: string) => {
      await createList(board.id, title);
    },
    [board.id],
  );

  const handleCreateCard = useCallback(
    async (listId: string, title: string, startDate?: string, dueDate?: string) => {
      await createCard(listId, title, board.id, startDate, dueDate);
    },
    [board.id],
  );

  // Flatten all cards for Gantt
  const ganttCards = board.lists.flatMap((list) =>
    list.cards
      .filter((card) => card.startDate && card.dueDate)
      .map((card) => ({
        id: card.id,
        title: card.title,
        listTitle: list.title,
        startDate: card.startDate!.toISOString(),
        dueDate: card.dueDate!.toISOString(),
      })),
  );

  const allGanttCards = board.lists.flatMap((list) =>
    list.cards.map((card) => ({
      id: card.id,
      title: card.title,
      listTitle: list.title,
      startDate: card.startDate?.toISOString() ?? "",
      dueDate: card.dueDate?.toISOString() ?? "",
    })),
  );

  return (
    <KanbanProvider initialColumns={columns} onMove={handleMove}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-surface/50 px-6 py-3">
          <BoardHeader title={board.title} />
          <div className="flex rounded-lg border border-surface/40 bg-surface/15 p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "kanban"
                  ? "bg-glow/20 text-glow"
                  : "text-muted hover:text-light"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("gantt")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "gantt"
                  ? "bg-glow/20 text-glow"
                  : "text-muted hover:text-light"
              }`}
            >
              Gantt
            </button>
          </div>
        </div>

        {view === "kanban" ? (
          <KanbanBoardContent
            onCreateList={handleCreateList}
            onCreateCard={handleCreateCard}
          />
        ) : (
          <GanttView cards={allGanttCards} />
        )}
      </div>
    </KanbanProvider>
  );
}

function KanbanBoardContent({
  onCreateList,
  onCreateCard,
}: {
  onCreateList: (title: string) => Promise<void>;
  onCreateCard: (listId: string, title: string, startDate?: string, dueDate?: string) => Promise<void>;
}) {
  const { columns } = useKanban();

  return (
    <div className="flex flex-1 items-start gap-3 overflow-x-auto p-6">
      {columns.map((col) => (
        <ListColumn
          key={col.id}
          column={col}
          onCreateCard={onCreateCard}
        />
      ))}
      <NewListForm onSubmit={onCreateList} />
    </div>
  );
}
