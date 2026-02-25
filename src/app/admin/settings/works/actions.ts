"use server";

import { revalidatePath } from "next/cache";
import { createWork, updateWork, deleteWork } from "@/application/use-cases";

export async function createWorkAction(data: any) {
  await createWork(data);
  revalidatePath("/admin/settings/works");
  revalidatePath("/");
}

export async function updateWorkAction(id: string, data: any) {
  await updateWork(id, data);
  revalidatePath("/admin/settings/works");
  revalidatePath("/");
}

export async function deleteWorkAction(id: string) {
  await deleteWork(id);
  revalidatePath("/admin/settings/works");
  revalidatePath("/");
}
