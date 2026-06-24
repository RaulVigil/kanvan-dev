import type { UniqueIdentifier } from "@dnd-kit/core";

/** Un contenedor de cards (equivale a una List de Prisma) */
export interface KanbanColumn {
  id: UniqueIdentifier;
  title: string;
  items: KanbanItem[];
}

/** Una card dentro de una columna (equivale a un Card de Prisma) */
export interface KanbanItem {
  id: UniqueIdentifier;
  title: string;
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
}

/** Evento que se emite al soltar una card (inter-columna o intra-columna) */
export interface KanbanMoveEvent {
  activeId: UniqueIdentifier;
  overId: UniqueIdentifier;
  sourceColumnId: UniqueIdentifier;
  targetColumnId: UniqueIdentifier;
}
