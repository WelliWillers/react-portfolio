import { getPostBySlug } from "@/application/use-cases";
import { PostPage } from "@/components/public/PostPage";
import { notFound } from "next/navigation";
import { PostViewTracker } from "./ViewTracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <>
      <PostViewTracker postId={post.id} />
      <PostPage post={post} />
    </>
  );
}
