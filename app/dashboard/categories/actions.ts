"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  const result = CategorySchema.safeParse({ name, type, icon, color });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
    icon,
    color,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  const result = CategorySchema.safeParse({ name, type, icon, color });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      type,
      icon,
      color,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/categories");
  return { success: true };
}
