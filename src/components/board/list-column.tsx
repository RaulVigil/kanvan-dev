"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { KanbanColumn } from "@/lib/dnd/types";
import { SortableCard } from "./sortable-card";
import { CardItem } from "./card-item";
import { NewCardForm } from "./new-card-form";

interface ListColumnProps {
  column: KanbanColumn;
  onCreateCard: (listId: string, title: string, startDate?: string, dueDate?: string) => Promise<void>;
}

export function ListColumn({ column, onCreateCard }: ListColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-xl border transition-colors ${
        isOver
          ? "border-glow/40 bg-surface/40 shadow-[0_0_16px_rgba(123,189,232,0.10)]"
          : "border-surface/40 bg-surface/15"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <h3 className="text-sm font-semibold text-light">{column.title}</h3>
        <span className="ml-auto rounded-full bg-surface/60 px-1.5 py-0.5 text-[11px] font-medium text-muted tabular-nums">
          {column.items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-1.5 px-2 pb-2 min-h-[4px]">
        <SortableContext
          items={column.items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.items.map((item) => (
            <SortableCard key={item.id} id={String(item.id)}>
              <CardItem
                id={String(item.id)}
                title={item.title}
                description={item.description}
                dueDate={item.dueDate}
              />
            </SortableCard>
          ))}
        </SortableContext>
      </div>

      {/* Footer */}
      <div className="px-2 pb-2">
        <NewCardForm
          listId={String(column.id)}
          onSubmit={(title, startDate, dueDate) =>
            onCreateCard(String(column.id), title, startDate, dueDate)
          }
        />
      </div>
    </div>
  );
}
