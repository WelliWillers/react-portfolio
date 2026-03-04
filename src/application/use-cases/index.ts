import { PrismaProjectRepository } from "@/infrastructure/repositories/project.repository";
import {
  PrismaSkillRepository,
  PrismaCertificateRepository,
  PrismaServiceRepository,
  PrismaContactRepository,
  PrismaProfileRepository,
  PrismaWorkRepository,
} from "@/infrastructure/repositories/others.repository";
import {
  fetchGithubRepos,
  fetchRepoReadme,
  generateSlug,
} from "@/lib/github/service";
import { PrismaBlogRepository } from "@/infrastructure/repositories/blog.repopsitory";
import { Post, PostCategory } from "@/domain/entities";

const projectRepo = new PrismaProjectRepository();
const skillRepo = new PrismaSkillRepository();
const certRepo = new PrismaCertificateRepository();
const serviceRepo = new PrismaServiceRepository();
const contactRepo = new PrismaContactRepository();
const profileRepo = new PrismaProfileRepository();
const workRepo = new PrismaWorkRepository();
const blogRepo = new PrismaBlogRepository();

// Projects
export const getPublishedProjects = () => projectRepo.findPublished();
export const getAllProjects = () => projectRepo.findAll();
export const getAllProjectsViews = () => projectRepo.getAllProjectsViews();
export const getProjectBySlug = (slug: string) => projectRepo.findBySlug(slug);
export const updateProject = (id: string, data: any) =>
  projectRepo.update(id, data);
export const deleteProject = (id: string) => projectRepo.delete(id);
export const createProject = (data: any) => projectRepo.create(data);

export async function getProjectBySlugWithReadme(slug: string) {
  const project = await projectRepo.findBySlug(slug);
  if (!project) return null;

  const shouldFetch =
    !project.readme ||
    !project.readmeUpdatedAt ||
    Date.now() - new Date(project.readmeUpdatedAt).getTime() >
      1000 * 60 * 60 * 24;

  if (shouldFetch && project.githubUrl) {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const fullName = project.githubUrl.replace("https://github.com/", "");
      const readme = await fetchRepoReadme(fullName, token);

      if (readme !== null) {
        await projectRepo.update(project.id, {
          readme,
          readmeUpdatedAt: new Date(),
        });
        return { ...project, readme };
      }
    }
  }

  return project;
}

export async function syncGithubRepos() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  if (!token || !username)
    throw new Error("GITHUB_TOKEN and GITHUB_USERNAME required");

  const repos = await fetchGithubRepos(username, token);
  const results = await Promise.allSettled(
    repos.map(async (repo) => {
      projectRepo.upsertFromGithub({
        githubId: repo.id,
        slug: generateSlug(repo.name),
        title: repo.name,
        description: repo.description,
        imageUrl: null,
        views: 0,
        githubUrl: repo.html_url,
        liveUrl: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        category: "FULLSTACK",
        published: false,
        featured: false,
      });
    }),
  );
  return {
    synced: results.filter((r) => r.status === "fulfilled").length,
    total: repos.length,
  };
}

// Skills
export const getSkills = () => skillRepo.findAll();
export const createSkill = (data: any) => skillRepo.create(data);
export const updateSkill = (id: string, data: any) =>
  skillRepo.update(id, data);
export const deleteSkill = (id: string) => skillRepo.delete(id);

// Certificates
export const getCertificates = () => certRepo.findAll();
export const createCertificate = (data: any) => certRepo.create(data);
export const updateCertificate = (id: string, data: any) =>
  certRepo.update(id, data);
export const deleteCertificate = (id: string) => certRepo.delete(id);

// Services
export const getServices = () => serviceRepo.findAll();
export const createService = (data: any) => serviceRepo.create(data);
export const updateService = (id: string, data: any) =>
  serviceRepo.update(id, data);
export const deleteService = (id: string) => serviceRepo.delete(id);

// Contacts
export const getContacts = () => contactRepo.findAll();
export const getVisibleContacts = () => contactRepo.findVisible();
export const createContact = (data: any) => contactRepo.create(data);
export const updateContact = (id: string, data: any) =>
  contactRepo.update(id, data);
export const deleteContact = (id: string) => contactRepo.delete(id);

// Profile
export const getProfile = () => profileRepo.get();
export const upsertProfile = (data: any) => profileRepo.upsert(data);

// work
export const getWorks = () => workRepo.findAll();
export const createWork = (data: any) => workRepo.create(data);
export const updateWork = (id: string, data: any) => workRepo.update(id, data);
export const deleteWork = (id: string) => workRepo.delete(id);

//blog

//

export async function getAllPosts(): Promise<Post[]> {
  return blogRepo.findAll();
}

export async function getPublishedPosts(): Promise<Post[]> {
  return blogRepo.findPublished();
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await blogRepo.findPublished();
  return posts.filter((p) => p.featured);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return blogRepo.findBySlug(slug);
}

export async function createPost(
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
): Promise<Post> {
  return blogRepo.create(data);
}

export async function updatePost(
  id: string,
  data: Partial<Post>,
): Promise<Post> {
  const payload: Partial<Post> = { ...data };

  if (data.content) {
    payload.readTime = blogRepo.estimateReadTime(data.content);
  }

  return blogRepo.update(id, payload);
}

export async function deletePost(id: string): Promise<void> {
  return blogRepo.delete(id);
}

export async function getAllCategories(): Promise<PostCategory[]> {
  const categories = await blogRepo.findAllCategories();
  return categories ?? [];
}

export async function getBlogAnalytics() {
  const [allPosts, views] = await Promise.all([
    blogRepo.findAll(),
    blogRepo.getAllPostsViews(),
  ]);

  const published = allPosts.filter((p) => p.published);
  const featured = allPosts.filter((p) => p.featured);
  const drafts = allPosts.filter((p) => !p.published);
  const totalViews = allPosts.reduce((acc, p) => acc + (p.views ?? 0), 0);

  const topPosts = [...published]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  return {
    total: allPosts.length,
    published: published.length,
    featured: featured.length,
    drafts: drafts.length,
    totalViews,
    topPosts,
    viewsByDay: views,
  };
}

export async function getAllComments() {
  return blogRepo.findAllComments();
}

export async function approveComment(id: string) {
  return blogRepo.approveComment(id);
}

export async function replyToComment(id: string, reply: string) {
  return blogRepo.replyComment(id, reply);
}

export async function deleteComment(id: string) {
  return blogRepo.deleteComment(id);
}

export function estimateReadTime(content: string): number {
  return blogRepo.estimateReadTime(content);
}
