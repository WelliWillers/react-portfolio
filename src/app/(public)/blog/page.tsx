import { prisma } from "@/lib/db/prisma";
import { BlogList } from "@/components/public/BlogList";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return <BlogList posts={posts} />;
}
