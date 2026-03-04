import { prisma } from "@/lib/db/prisma";
import { DashboardCharts } from "@/components/admin/Dashboard/DashboardCharts";
import {
  subDays,
  subWeeks,
  subMonths,
  format,
  startOfWeek,
  startOfMonth,
} from "date-fns";

async function getDashboardData() {
  const now = new Date();
  const startThisWeek = startOfWeek(now);
  const startLastWeek = startOfWeek(subWeeks(now, 1));
  const startThisMonth = startOfMonth(now);
  const startLastMonth = startOfMonth(subMonths(now, 1));

  const [
    totalProjects,
    publishedProjects,
    totalPosts,
    publishedPosts,
    pendingComments,
    totalSkills,
    projectViews,
    postViews,
    topProjects,
    topPosts,
    projectsByCategory,

    skillsByCategory,

    projectsWithoutImage,
    projectsWithoutViews,

    pendingCommentsList,

    githubStats,

    projectViewsThisWeek,
    projectViewsLastWeek,
    postViewsThisWeek,
    postViewsLastWeek,

    projectViewsThisMonth,
    projectViewsLastMonth,
    postViewsThisMonth,
    postViewsLastMonth,

    recentProjects,
    recentPosts,
    recentComments,
    recentProjectViews,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.postComment.count({ where: { approved: false } }),
    prisma.skill.count(),

    prisma.projectView.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: { createdAt: { gte: subDays(now, 13) } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.postView.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: { createdAt: { gte: subDays(now, 13) } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 5,
      select: { title: true, views: true, category: true, language: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        title: true,
        views: true,
        category: { select: { name: true } },
      },
    }),
    prisma.project.groupBy({
      by: ["category"],
      _count: { id: true },
      where: { published: true },
    }),

    prisma.skill.groupBy({
      by: ["category"],
      _count: { id: true },
      _avg: { level: true },
    }),

    prisma.project.findMany({
      where: { published: true, imageUrl: null },
      select: { id: true, title: true, category: true },
      take: 5,
    }),

    prisma.project.findMany({
      where: { published: true, views: 0 },
      select: { id: true, title: true, category: true },
      take: 5,
    }),

    prisma.postComment.findMany({
      where: { approved: false },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.project.aggregate({
      _sum: { stars: true, forks: true },
      _max: { updatedAt: true },
      where: { githubId: { not: null } },
    }),

    prisma.projectView.count({ where: { createdAt: { gte: startThisWeek } } }),
    prisma.projectView.count({
      where: { createdAt: { gte: startLastWeek, lt: startThisWeek } },
    }),
    prisma.postView.count({ where: { createdAt: { gte: startThisWeek } } }),
    prisma.postView.count({
      where: { createdAt: { gte: startLastWeek, lt: startThisWeek } },
    }),

    prisma.projectView.count({ where: { createdAt: { gte: startThisMonth } } }),
    prisma.projectView.count({
      where: { createdAt: { gte: startLastMonth, lt: startThisMonth } },
    }),
    prisma.postView.count({ where: { createdAt: { gte: startThisMonth } } }),
    prisma.postView.count({
      where: { createdAt: { gte: startLastMonth, lt: startThisMonth } },
    }),

    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { title: true, updatedAt: true, published: true, slug: true },
    }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { title: true, updatedAt: true, published: true, slug: true },
    }),
    prisma.postComment.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { post: { select: { title: true, slug: true } } },
    }),
    prisma.projectView.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: { select: { title: true, slug: true } } },
    }),
  ]);

  function normalizeViewsByDay(
    views: { createdAt: Date; _count: { id: number } }[],
  ) {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const key = format(subDays(now, i), "MMM dd");
      days[key] = 0;
    }
    for (const v of views) {
      const key = format(new Date(v.createdAt), "MMM dd");
      if (key in days) days[key] += v._count.id;
    }
    return Object.entries(days).map(([date, views]) => ({ date, views }));
  }

  function calcDelta(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const activityFeed = [
    ...recentProjects.map((p) => ({
      type: "project" as const,
      title: p.title,
      slug: p.slug,
      label: p.published ? "Project updated" : "Project saved as draft",
      date: p.updatedAt,
    })),
    ...recentPosts.map((p) => ({
      type: "post" as const,
      title: p.title,
      slug: p.slug,
      label: p.published ? "Post published" : "Post saved as draft",
      date: p.updatedAt,
    })),
    ...recentComments.map((c) => ({
      type: "comment" as const,
      title: c.post.title,
      slug: c.post.slug,
      label: `New comment by ${c.name}`,
      date: c.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const avgReadTime = await prisma.post.aggregate({
    _avg: { readTime: true },
    where: { published: true, readTime: { not: null } },
  });

  return {
    stats: {
      totalProjects,
      publishedProjects,
      totalPosts,
      publishedPosts,
      pendingComments,
      totalSkills,
      totalProjectViews: topProjects.reduce((a, p) => a + p.views, 0),
      totalPostViews: topPosts.reduce((a, p) => a + p.views, 0),
      avgReadTime: Math.round(avgReadTime._avg.readTime ?? 0),
      publishedProjectsRate: Math.round(
        (publishedProjects / (totalProjects || 1)) * 100,
      ),
      publishedPostsRate: Math.round(
        (publishedPosts / (totalPosts || 1)) * 100,
      ),
    },
    projectViewsByDay: normalizeViewsByDay(projectViews),
    postViewsByDay: normalizeViewsByDay(postViews),
    topProjects,
    topPosts,
    projectsByCategory: projectsByCategory.map((p) => ({
      name: p.category,
      value: p._count.id,
    })),
    skillsByCategory: skillsByCategory.map((s) => ({
      name: s.category,
      count: s._count.id,
      avgLevel: Math.round((s._avg.level ?? 0) * 10) / 10,
    })),
    projectsWithoutImage,
    projectsWithoutViews,
    pendingCommentsList,
    githubStats: {
      totalStars: githubStats._sum.stars ?? 0,
      totalForks: githubStats._sum.forks ?? 0,
      lastSync: githubStats._max.updatedAt,
    },
    comparisons: {
      week: {
        projectViews: {
          current: projectViewsThisWeek,
          previous: projectViewsLastWeek,
          delta: calcDelta(projectViewsThisWeek, projectViewsLastWeek),
        },
        postViews: {
          current: postViewsThisWeek,
          previous: postViewsLastWeek,
          delta: calcDelta(postViewsThisWeek, postViewsLastWeek),
        },
      },
      month: {
        projectViews: {
          current: projectViewsThisMonth,
          previous: projectViewsLastMonth,
          delta: calcDelta(projectViewsThisMonth, projectViewsLastMonth),
        },
        postViews: {
          current: postViewsThisMonth,
          previous: postViewsLastMonth,
          delta: calcDelta(postViewsThisMonth, postViewsLastMonth),
        },
      },
    },
    activityFeed,
    recentProjectViews: recentProjectViews.map((v) => ({
      project: v.project.title,
      slug: v.project.slug,
      ip: v.ip ?? "unknown",
      date: v.createdAt,
    })),
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of your portfolio performance.
        </p>
      </div>
      <DashboardCharts data={data} />
    </div>
  );
}
