import {
  Certificate,
  Contact,
  Profile,
  Service,
  Skill,
  Work,
} from "@/domain/entities";
import {
  ICertificateRepository,
  IContactRepository,
  IProfileRepository,
  IServiceRepository,
  ISkillRepository,
  IWorkRepository,
} from "@/domain/repositories";
import { prisma } from "@/lib/db/prisma";

export class PrismaSkillRepository implements ISkillRepository {
  async findAll() {
    return prisma.skill.findMany({ orderBy: { level: "desc" } }) as Promise<
      Skill[]
    >;
  }
  async create(data: Omit<Skill, "id">) {
    return prisma.skill.create({ data }) as Promise<Skill>;
  }
  async update(id: string, data: Partial<Skill>) {
    return prisma.skill.update({ where: { id }, data }) as Promise<Skill>;
  }
  async delete(id: string) {
    await prisma.skill.delete({ where: { id } });
  }
}

export class PrismaCertificateRepository implements ICertificateRepository {
  async findAll() {
    return prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    }) as Promise<Certificate[]>;
  }
  async create(data: Omit<Certificate, "id">) {
    return prisma.certificate.create({ data }) as Promise<Certificate>;
  }
  async update(id: string, data: Partial<Certificate>) {
    return prisma.certificate.update({
      where: { id },
      data,
    }) as Promise<Certificate>;
  }
  async delete(id: string) {
    await prisma.certificate.delete({ where: { id } });
  }
}

export class PrismaServiceRepository implements IServiceRepository {
  async findAll(): Promise<Service[]> {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "asc" },
    });

    return services.map(this.mapToEntity);
  }

  async create(
    data: Omit<Service, "id" | "createdAt" | "updatedAt">,
  ): Promise<Service> {
    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon ?? null,
        highlights: data.highlights ? JSON.stringify(data.highlights) : "",
      },
    });

    return this.mapToEntity(service);
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.highlights !== undefined && {
          highlights: JSON.stringify(data.highlights),
        }),
      },
    });

    return this.mapToEntity(service);
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({ where: { id } });
  }

  private mapToEntity(raw: any): Service {
    return {
      ...raw,
      highlights: raw.highlights ? JSON.parse(raw.highlights as string) : [],
    };
  }
}

export class PrismaWorkRepository implements IWorkRepository {
  async findAll(): Promise<Work[]> {
    const works = await prisma.work.findMany({
      orderBy: { createdAt: "asc" },
    });

    return works.map(this.mapToEntity);
  }

  async create(
    data: Omit<Work, "id" | "createdAt" | "updatedAt">,
  ): Promise<Work> {
    console.log("Creating work with data:", data);
    const work = await prisma.work.create({
      data: {
        title: data.title,
        description: data.description,
        isCurrent: data.isCurrent,
        company: data.company,
        startDate: data.startDate,
        endDate: data.isCurrent ? null : (data.endDate ?? null),
      },
    });

    return this.mapToEntity(work);
  }

  async update(id: string, data: Partial<Work>): Promise<Work> {
    const work = await prisma.work.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
      },
    });

    return this.mapToEntity(work);
  }

  async delete(id: string): Promise<void> {
    await prisma.work.delete({ where: { id } });
  }

  private mapToEntity(raw: any): Work {
    return {
      ...raw,
    };
  }
}

export class PrismaContactRepository implements IContactRepository {
  async findAll() {
    return prisma.contact.findMany({
      orderBy: { createdAt: "asc" },
    }) as Promise<Contact[]>;
  }
  async findVisible() {
    return prisma.contact.findMany({
      where: { visible: true },
      orderBy: { createdAt: "asc" },
    }) as Promise<Contact[]>;
  }
  async create(data: Omit<Contact, "id">) {
    return prisma.contact.create({ data }) as Promise<Contact>;
  }
  async update(id: string, data: Partial<Contact>) {
    return prisma.contact.update({ where: { id }, data }) as Promise<Contact>;
  }
  async delete(id: string) {
    await prisma.contact.delete({ where: { id } });
  }
}

export class PrismaProfileRepository implements IProfileRepository {
  async get() {
    return prisma.profile.findFirst() as Promise<Profile | null>;
  }

  async upsert(data: Partial<Profile>) {
    return prisma.profile.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        name: "Your Name",
        subtitle: "Your Subtitle",
        title: "Developer",
        bio: "Hello!",
        ...data,
      },
      update: data,
    }) as Promise<Profile>;
  }
}
