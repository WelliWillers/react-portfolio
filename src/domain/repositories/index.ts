import {
  Certificate,
  Contact,
  Post,
  PostCategory,
  PostComment,
  Profile,
  Project,
  Service,
  Skill,
  Work,
} from "../entities";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findPublished(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findByGithubId(id: number): Promise<Project | null>;
  create(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
  upsertFromGithub(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project>;
  getAllProjectsViews(): Promise<any>;
}

export interface ISkillRepository {
  findAll(): Promise<Skill[]>;
  create(data: Omit<Skill, "id">): Promise<Skill>;
  update(id: string, data: Partial<Skill>): Promise<Skill>;
  delete(id: string): Promise<void>;
}

export interface ICertificateRepository {
  findAll(): Promise<Certificate[]>;
  create(data: Omit<Certificate, "id">): Promise<Certificate>;
  update(id: string, data: Partial<Certificate>): Promise<Certificate>;
  delete(id: string): Promise<void>;
}

export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  create(data: Omit<Service, "id">): Promise<Service>;
  update(id: string, data: Partial<Service>): Promise<Service>;
  delete(id: string): Promise<void>;
}

export interface IWorkRepository {
  findAll(): Promise<Work[]>;
  create(data: Omit<Work, "id">): Promise<Work>;
  update(id: string, data: Partial<Work>): Promise<Work>;
  delete(id: string): Promise<void>;
}

export interface IContactRepository {
  findAll(): Promise<Contact[]>;
  findVisible(): Promise<Contact[]>;
  create(data: Omit<Contact, "id">): Promise<Contact>;
  update(id: string, data: Partial<Contact>): Promise<Contact>;
  delete(id: string): Promise<void>;
}

export interface IProfileRepository {
  get(): Promise<Profile | null>;
  upsert(data: Partial<Profile>): Promise<Profile>;
}

export interface IBlogRepository {
  findAll(): Promise<Post[]>;
  findPublished(): Promise<Post[]>;
  findBySlug(slug: string): Promise<Post | null>;
  findAllCategories(): Promise<PostCategory[] | null>;
  create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
  getAllPostsViews(): Promise<any>;
  estimateReadTime(content: string): number;

  findAllComments(): Promise<PostComment[]>;
  findCommentsByPost(postId: string): Promise<PostComment[]>;
  approveComment(id: string): Promise<PostComment>;
  replyComment(id: string, reply: string): Promise<PostComment>;
  deleteComment(id: string): Promise<void>;
  createComment(data: {
    postId: string;
    name: string;
    email?: string;
    content: string;
  }): Promise<PostComment>;
  createComment(data: {
    postId: string;
    name: string;
    email?: string;
    content: string;
  }): Promise<PostComment>;

  trackView(postId: string, ip?: string): Promise<void>;
}
