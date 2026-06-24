"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  // Daily registration limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await prisma.user.count({
    where: { createdAt: { gte: today } },
  });
  if (count >= 2) {
    return { error: "Límite diario alcanzado. Probá mañana." };
  }

  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) || undefined;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  // Ensure User record exists (fallback if trigger failed)
  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {},
        create: {
          id: data.user.id,
          email: data.user.email!,
          name,
        },
      });
    } catch {
      // trigger may have already created it
    }
  }

  if (!data.session) return { redirect: "/login?check_email=true" };

  revalidatePath("/", "layout");
  return { redirect: "/" };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: "Credenciales inválidas" };

  revalidatePath("/", "layout");
  return { redirect: "/" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { redirect: "/login" };
}
