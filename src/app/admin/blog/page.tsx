import { getAllCategories, getAllPosts } from "@/application/use-cases";
import { BlogManager } from "@/components/admin/Blog/BlogManager";

export default async function AdminBlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return <BlogManager posts={posts} categories={categories} />;
}
