import { Post, PostCategory, PostComment } from "@/domain/entities";
import { IBlogRepository } from "@/domain/repositories";
import { prisma } from "@/lib/db/prisma";

export class PrismaBlogRepository implements IBlogRepository {
  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return posts.map(this.mapToEntity);
  }

  async findPublished(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        category: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return posts.map(this.mapToEntity);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) return null;
    return this.mapToEntity(post);
  }

  async findAllCategories(): Promise<PostCategory[]> {
    return prisma.postCategory.findMany({ orderBy: { name: "asc" } });
  }

  async create(
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  ): Promise<Post> {
    const { categoryId, ...rest } = data as any;

    let resolvedCategoryId: string | null = null;

    if (categoryId?.trim()) {
      const cat = await this.upsertCategory(categoryId.trim());
      resolvedCategoryId = cat.id;
      delete rest.categoryId;
    } else if (categoryId) {
      resolvedCategoryId = categoryId;
    }

    const post = await prisma.post.create({
      data: {
        ...rest,
        slug: this.generateSlug(data.title),
        ...(resolvedCategoryId && {
          category: { connect: { id: resolvedCategoryId } },
        }),
      },
      include: {
        category: true,
      },
    });

    return this.mapToEntity(post);
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const { categoryId, ...rest } = data as any;

    let resolvedCategoryId: string | null | undefined;

    if (categoryId !== undefined) {
      if (categoryId?.trim()) {
        const cat = await this.upsertCategory(categoryId.trim());
        resolvedCategoryId = cat.id;
      } else {
        resolvedCategoryId = null;
      }
      delete rest.categoryId;
    } else if (categoryId !== undefined) {
      resolvedCategoryId = categoryId;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(data.title && { slug: this.generateSlug(data.title) }),
        ...(resolvedCategoryId !== undefined && {
          category: resolvedCategoryId
            ? { connect: { id: resolvedCategoryId } }
            : { disconnect: true },
        }),
      },
      include: {
        category: true,
      },
    });

    return this.mapToEntity(post);
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async getAllPostsViews(): Promise<{
    total: number;
    byDay: { date: string; views: number }[];
  }> {
    const [aggregate, byDay] = await Promise.all([
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.postView.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    return {
      total: aggregate._sum.views ?? 0,
      byDay: byDay.map((row) => ({
        date: row.createdAt.toISOString().split("T")[0],
        views: row._count.id,
      })),
    };
  }

  estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }

  async upsertCategory(name: string): Promise<PostCategory> {
    const slug = this.generateSlug(name);
    return prisma.postCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  private mapToEntity(raw: any): Post {
    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      excerpt: raw.excerpt ?? null,
      content: raw.content,
      coverUrl: raw.coverUrl ?? null,
      published: raw.published,
      featured: raw.featured,
      views: raw.views,
      readTime: raw.readTime ?? null,
      categoryId: raw.categoryId ?? null,
      category: raw.category ?? null,
      comments: raw.comments ?? [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async findAllComments(): Promise<PostComment[]> {
    const comments = await prisma.postComment.findMany({
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    return comments;
  }

  async findCommentsByPost(postId: string): Promise<PostComment[]> {
    return prisma.postComment.findMany({
      where: { postId },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async approveComment(id: string): Promise<PostComment> {
    return prisma.postComment.update({
      where: { id },
      data: { approved: true },
      include: { post: { select: { title: true, slug: true } } },
    });
  }

  async replyComment(id: string, reply: string): Promise<PostComment> {
    return prisma.postComment.update({
      where: { id },
      data: { reply, approved: true },
      include: { post: { select: { title: true, slug: true } } },
    });
  }

  async deleteComment(id: string): Promise<void> {
    await prisma.postComment.delete({ where: { id } });
  }

  async createComment(data: {
    postId: string;
    name: string;
    email?: string;
    content: string;
  }): Promise<PostComment> {
    return prisma.postComment.create({
      data: {
        postId: data.postId,
        name: data.name,
        email: data.email ?? null,
        content: data.content,
        approved: false,
      },
      include: {
        post: { select: { title: true, slug: true } },
      },
    });
  }

  async trackView(postId: string, ip?: string): Promise<void> {
    const recent = await prisma.postView.findFirst({
      where: {
        postId,
        ip,
        createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60) },
      },
    });

    if (recent) return;

    await prisma.$transaction([
      prisma.postView.create({
        data: { postId, ip: ip ?? null },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
      }),
    ]);
  }
}
