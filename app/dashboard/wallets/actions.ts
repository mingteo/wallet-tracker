"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getWallets() {
  const supabase = await createClient();

  const { data: wallets, error } = await supabase
    .from("wallets")
    .select(
      `
      *,
      wallet_groups (
        name,
        icon
      )
    `
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching wallets:", error);
    return [];
  }

  return wallets;
}

export async function getWalletGroups() {
  const supabase = await createClient();
  const { data: groups, error } = await supabase
    .from("wallet_groups")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching wallet groups:", error);
    return [];
  }

  return groups;
}

export async function createWallet(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const balance = parseFloat(formData.get("balance") as string) || 0;
  const currency = (formData.get("currency") as string) || "IDR";
  const group_id = formData.get("group_id") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const is_archived = formData.get("is_archived") === "on";
  const exclude_from_stats = formData.get("exclude_from_stats") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("wallets").insert({
    user_id: user.id,
    name,
    balance,
    currency,
    group_id: group_id || null,
    color,
    icon: icon || null,
    is_archived,
    exclude_from_stats,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/wallets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateWallet(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const balance = parseFloat(formData.get("balance") as string) || 0;
  const currency = (formData.get("currency") as string) || "IDR";
  const group_id = formData.get("group_id") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const is_archived = formData.get("is_archived") === "on";
  const exclude_from_stats = formData.get("exclude_from_stats") === "on";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("wallets")
    .update({
      name,
      balance,
      currency,
      group_id: group_id || null,
      color,
      icon: icon || null,
      is_archived,
      exclude_from_stats,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/wallets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteWallet(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/wallets");
  revalidatePath("/dashboard");
  return { success: true };
}
