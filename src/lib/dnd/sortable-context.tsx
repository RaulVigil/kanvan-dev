"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { KanbanColumn, KanbanMoveEvent } from "./types";

interface KanbanContextValue {
  columns: KanbanColumn[];
  activeId: string | null;
  activeColumnId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export function useKanban() {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used inside <KanbanProvider>");
  return ctx;
}

export function KanbanProvider({
  children,
  initialColumns,
  onMove,
}: {
  children: ReactNode;
  initialColumns: KanbanColumn[];
  onMove?: (event: KanbanMoveEvent) => void;
}) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Sync when server revalidates and passes new initialColumns
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id);
      setActiveId(id);

      const col = columns.find((c) => c.items.some((i) => String(i.id) === id));
      setActiveColumnId(col ? String(col.id) : null);
    },
    [columns],
  );

  const handleDragOver = useCallback(
    (_event: DragOverEvent) => {
      // visual feedback handled by @dnd-kit sortable sensors
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        setActiveId(null);
        setActiveColumnId(null);
        return;
      }

      const activeItemId = String(active.id);
      const overId = String(over.id);

      // find which column the active item belongs to
      const sourceCol = columns.find((c) =>
        c.items.some((i) => String(i.id) === activeItemId),
      );
      if (!sourceCol) {
        setActiveId(null);
        setActiveColumnId(null);
        return;
      }

      // target: could be an item or a column id
      const targetCol =
        columns.find((c) => String(c.id) === overId) ??
        columns.find((c) => c.items.some((i) => String(i.id) === overId));

      if (!targetCol) {
        setActiveId(null);
        setActiveColumnId(null);
        return;
      }

      const sourceColId = String(sourceCol.id);
      const targetColId = String(targetCol.id);

      // Remove from source
      const movingItem = sourceCol.items.find(
        (i) => String(i.id) === activeItemId,
      );
      if (!movingItem) {
        setActiveId(null);
        setActiveColumnId(null);
        return;
      }

      const newSourceItems = sourceCol.items.filter(
        (i) => String(i.id) !== activeItemId,
      );

      // Insert into target
      const overIndex = targetCol.items.findIndex(
        (i) => String(i.id) === overId,
      );
      const targetItems = [...targetCol.items];
      const insertIndex =
        sourceColId === targetColId && overIndex === -1
          ? targetItems.length
          : overIndex >= 0
            ? overIndex
            : targetItems.length;

      targetItems.splice(insertIndex, 0, movingItem);

      const newColumns = columns.map((col) => {
        if (String(col.id) === sourceColId)
          return { ...col, items: newSourceItems };
        if (String(col.id) === targetColId)
          return { ...col, items: targetItems };
        return col;
      });

      setColumns(newColumns);
      setActiveId(null);
      setActiveColumnId(null);

      onMove?.({
        activeId: activeItemId,
        overId,
        sourceColumnId: sourceColId,
        targetColumnId: targetColId,
      });
    },
    [columns, onMove],
  );

  return (
    <KanbanContext.Provider
      value={{
        columns,
        activeId,
        activeColumnId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </KanbanContext.Provider>
  );
}

/** Returns the active card element for the DragOverlay */
export function KanbanDragOverlay({
  children,
}: {
  children: (activeId: string) => ReactNode;
}) {
  const { activeId, columns } = useKanban();
  if (!activeId) return null;
  return <>{children(activeId)}</>;
}
