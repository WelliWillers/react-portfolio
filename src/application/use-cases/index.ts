import { PrismaProjectRepository } from "@/infrastructure/repositories/project.repository";
import {
  PrismaSkillRepository,
  PrismaCertificateRepository,
  PrismaServiceRepository,
  PrismaContactRepository,
  PrismaProfileRepository,
} from "@/infrastructure/repositories/others.repository";
import {
  fetchGithubRepos,
  fetchRepoReadme,
  generateSlug,
} from "@/lib/github/service";

const projectRepo = new PrismaProjectRepository();
const skillRepo = new PrismaSkillRepository();
const certRepo = new PrismaCertificateRepository();
const serviceRepo = new PrismaServiceRepository();
const contactRepo = new PrismaContactRepository();
const profileRepo = new PrismaProfileRepository();

// Projects
export const getPublishedProjects = () => projectRepo.findPublished();
export const getAllProjects = () => projectRepo.findAll();
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
        githubUrl: repo.html_url,
        liveUrl: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        category: "OUTROS",
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
