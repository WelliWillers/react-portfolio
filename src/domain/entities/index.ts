export type ProjectCategory = "FRONTEND" | "BACKEND" | "MOBILE" | "OUTROS";

export interface Project {
  id: string;
  githubId?: number | null;
  slug: string;
  title: string;
  description?: string | null;
  readme?: string | null;
  readmeUpdatedAt?: Date | null;
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  stars: number;
  forks: number;
  language?: string | null;
  topics: string[];
  category: ProjectCategory;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string | null;
}

export interface Certificate {
  id: string;
  title: string;
  institution: string;
  date?: string | null;
  fileUrl?: string | null;
  credentialUrl?: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
}

export interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  url?: string | null;
  visible: boolean;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle?: string | null;
  bio: string;
  avatarUrl?: string | null;
  location?: string | null;
  githubUser?: string | null;
}
