import { prisma } from "@/lib/db/prisma";
import { IProjectRepository } from "@/domain/repositories";
import { Project } from "@/domain/entities";

function mapProject(p: any): Project {
  return {
    ...p,
    topics: JSON.parse(p.topics || "[]"),
  };
}

export class PrismaProjectRepository implements IProjectRepository {
  async getAllProjectsViews() {
    const result = await prisma.project.aggregate({
      _sum: { views: true },
    });
    return result;
  }
  async findAll() {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return projects.map(mapProject);
  }

  async findPublished() {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
    return projects.map(mapProject);
  }

  async findBySlug(slug: string) {
    const p = await prisma.project.findUnique({ where: { slug } });
    return p ? mapProject(p) : null;
  }

  async findByGithubId(id: number) {
    const p = await prisma.project.findUnique({ where: { githubId: id } });
    return p ? mapProject(p) : null;
  }

  async create(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
    const p = await prisma.project.create({
      data: { ...data, topics: JSON.stringify(data.topics) },
    });
    return mapProject(p);
  }

  async update(id: string, data: Partial<Project>) {
    const updateData: any = { ...data };
    if (data.topics) updateData.topics = JSON.stringify(data.topics);
    const p = await prisma.project.update({ where: { id }, data: updateData });
    return mapProject(p);
  }

  async delete(id: string) {
    await prisma.project.delete({ where: { id } });
  }

  async upsertFromGithub(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) {
    const p = await prisma.project.upsert({
      where: { githubId: data.githubId! },
      create: { ...data, topics: JSON.stringify(data.topics) },
      update: {
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        stars: data.stars,
        readme: data.readme,
        forks: data.forks,
        language: data.language,
        topics: JSON.stringify(data.topics),
      },
    });
    return mapProject(p);
  }
}
