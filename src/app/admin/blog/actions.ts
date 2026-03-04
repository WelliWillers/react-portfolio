"use server";

import {
  approveComment,
  createPost,
  deleteComment,
  deletePost,
  getAllComments,
  replyToComment,
  updatePost,
} from "@/application/use-cases/index";
import { PrismaBlogRepository } from "@/infrastructure/repositories/blog.repopsitory";
import { revalidatePath } from "next/cache";

const blogRepo = new PrismaBlogRepository();

export async function createPostAction(data: any) {
  await createPost(data);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function updatePostAction(id: string, data: any) {
  await updatePost(id, data);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function upsertCategoryAction(name: string) {
  const cat = await blogRepo.upsertCategory(name);
  revalidatePath("/admin/blog");
  return cat;
}

export async function getCommentsAction() {
  return getAllComments();
}

export async function approveCommentAction(id: string) {
  await approveComment(id);
  revalidatePath("/admin/blog/comments");
  revalidatePath("/blog");
}

export async function replyCommentAction(id: string, reply: string) {
  await replyToComment(id, reply);
  revalidatePath("/admin/blog/comments");
  revalidatePath("/blog");
}

export async function deleteCommentAction(id: string) {
  await deleteComment(id);
  revalidatePath("/admin/blog/comments");
  revalidatePath("/blog");
}
