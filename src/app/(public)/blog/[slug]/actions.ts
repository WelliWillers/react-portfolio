"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { PrismaBlogRepository } from "@/infrastructure/repositories/blog.repopsitory";

const blogRepo = new PrismaBlogRepository();

export async function submitCommentAction(data: {
  postId: string;
  name: string;
  email?: string;
  content: string;
}) {
  await blogRepo.createComment({
    postId: data.postId,
    name: data.name,
    email: data.email,
    content: data.content,
  });

  revalidatePath("/blog");
}

export async function trackPostViewAction(postId: string) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  await blogRepo.trackView(postId, ip);
}
