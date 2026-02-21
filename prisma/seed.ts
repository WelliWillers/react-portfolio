import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.dev' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.dev',
      password,
      name: 'Admin',
    },
  })

  await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Your Name',
      title: 'Full Stack Developer',
      bio: 'Passionate developer crafting modern web experiences.',
      location: 'Brasil',
    },
  })

  console.log('Seed complete:', user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
