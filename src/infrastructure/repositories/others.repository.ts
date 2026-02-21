import { prisma } from '@/lib/db/prisma'
import { ISkillRepository, ICertificateRepository, IServiceRepository, IContactRepository, IProfileRepository } from '@/domain/repositories'
import { Skill, Certificate, Service, Contact, Profile } from '@/domain/entities'

export class PrismaSkillRepository implements ISkillRepository {
  async findAll() {
    return prisma.skill.findMany({ orderBy: { level: 'desc' } }) as Promise<Skill[]>
  }
  async create(data: Omit<Skill, 'id'>) {
    return prisma.skill.create({ data }) as Promise<Skill>
  }
  async update(id: string, data: Partial<Skill>) {
    return prisma.skill.update({ where: { id }, data }) as Promise<Skill>
  }
  async delete(id: string) {
    await prisma.skill.delete({ where: { id } })
  }
}

export class PrismaCertificateRepository implements ICertificateRepository {
  async findAll() {
    return prisma.certificate.findMany({ orderBy: { createdAt: 'desc' } }) as Promise<Certificate[]>
  }
  async create(data: Omit<Certificate, 'id'>) {
    return prisma.certificate.create({ data }) as Promise<Certificate>
  }
  async update(id: string, data: Partial<Certificate>) {
    return prisma.certificate.update({ where: { id }, data }) as Promise<Certificate>
  }
  async delete(id: string) {
    await prisma.certificate.delete({ where: { id } })
  }
}

export class PrismaServiceRepository implements IServiceRepository {
  async findAll() {
    return prisma.service.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Service[]>
  }
  async create(data: Omit<Service, 'id'>) {
    return prisma.service.create({ data }) as Promise<Service>
  }
  async update(id: string, data: Partial<Service>) {
    return prisma.service.update({ where: { id }, data }) as Promise<Service>
  }
  async delete(id: string) {
    await prisma.service.delete({ where: { id } })
  }
}

export class PrismaContactRepository implements IContactRepository {
  async findAll() {
    return prisma.contact.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Contact[]>
  }
  async findVisible() {
    return prisma.contact.findMany({ where: { visible: true }, orderBy: { createdAt: 'asc' } }) as Promise<Contact[]>
  }
  async create(data: Omit<Contact, 'id'>) {
    return prisma.contact.create({ data }) as Promise<Contact>
  }
  async update(id: string, data: Partial<Contact>) {
    return prisma.contact.update({ where: { id }, data }) as Promise<Contact>
  }
  async delete(id: string) {
    await prisma.contact.delete({ where: { id } })
  }
}

export class PrismaProfileRepository implements IProfileRepository {
  async get() {
    return prisma.profile.findFirst() as Promise<Profile | null>
  }
  async upsert(data: Partial<Profile>) {
    return prisma.profile.upsert({
      where: { id: 'default' },
      create: { id: 'default', name: 'Your Name', title: 'Developer', bio: 'Hello!', ...data },
      update: data,
    }) as Promise<Profile>
  }
}
