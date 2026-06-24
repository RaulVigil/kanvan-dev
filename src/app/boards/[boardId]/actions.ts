"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// ── Helpers ──

async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return data.user.id;
}

async function checkPlanLimit(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.plan !== "PREMIUM") {
    const count = await prisma.board.count({ where: { userId } });
    if (count >= 1) {
      return { error: "Plan Free: máximo 1 tablero. Actualizá a Premium para crear más." };
    }
  }
  return { error: null };
}

// ── Board ──

export async function createBoard(title: string) {
  const userId = await getUserId();
  const limit = await checkPlanLimit(userId);
  if (limit.error) return limit;

  const board = await prisma.board.create({
    data: { title, userId },
  });

  revalidatePath("/");
  redirect(`/boards/${board.id}`);
}

export async function getBoards() {
  const userId = await getUserId();
  return prisma.board.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBoardWithListsAndCards(boardId: string) {
  const userId = await getUserId();
  return prisma.board.findFirst({
    where: { id: boardId, userId },
    include: {
      lists: {
        orderBy: { position: "asc" },
        include: { cards: { orderBy: { position: "asc" } } },
      },
    },
  });
}

export async function getUserPlan() {
  const userId = await getUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, email: true, name: true },
  });
  return user ?? { plan: "FREE" as const, email: "", name: null as string | null };
}

// ── List ──

export async function createList(boardId: string, title: string) {
  const userId = await getUserId();
  // Verify board ownership
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  if (!board) throw new Error("Tablero no encontrado");

  const last = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.list.create({
    data: {
      title,
      boardId,
      position: (last?.position ?? -1) + 1,
    },
  });

  revalidatePath(`/boards/${boardId}`);
}

// ── Card ──

export async function createCard(
  listId: string,
  title: string,
  boardId: string,
  startDate?: string,
  dueDate?: string,
) {
  const userId = await getUserId();
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  if (!board) throw new Error("Tablero no encontrado");

  const last = await prisma.card.findFirst({
    where: { listId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.card.create({
    data: {
      title,
      listId,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      position: (last?.position ?? -1) + 1,
    },
  });

  revalidatePath(`/boards/${boardId}`);
}

export async function moveCard(
  cardId: string,
  targetListId: string,
  boardId: string,
) {
  const userId = await getUserId();
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  if (!board) throw new Error("Tablero no encontrado");

  const maxPos = await prisma.card.findFirst({
    where: { listId: targetListId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.card.update({
    where: { id: cardId },
    data: {
      listId: targetListId,
      position: (maxPos?.position ?? -1) + 1,
    },
  });

  revalidatePath(`/boards/${boardId}`);
}

export async function deleteCard(cardId: string, boardId: string) {
  const userId = await getUserId();
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  if (!board) throw new Error("Tablero no encontrado");

  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath(`/boards/${boardId}`);
}
