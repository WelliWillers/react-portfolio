import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function blogSeed() {
  const categoryTech = await prisma.postCategory.upsert({
    where: { slug: "technology" },
    update: {},
    create: { name: "Technology", slug: "technology" },
  });

  const categoryCareer = await prisma.postCategory.upsert({
    where: { slug: "career" },
    update: {},
    create: { name: "Career", slug: "career" },
  });

  const post1 = await prisma.post.upsert({
    where: { slug: "building-my-portfolio-with-nextjs-15" },
    update: {},
    create: {
      slug: "building-my-portfolio-with-nextjs-15",
      title: "Building my portfolio with Next.js 15 and Clean Architecture",
      excerpt:
        "A deep dive into how I built a full-stack portfolio from scratch using Next.js 15, Prisma, and Clean Architecture principles.",
      content: `
## Why I decided to build from scratch

Most portfolio templates look the same. I wanted something that reflected how I actually think about code — structured, maintainable, and built to last.

So I started from zero with **Next.js 15 App Router**, **Prisma ORM**, and a **Clean Architecture** approach that separates domain, application, and infrastructure concerns.

## The stack

Here's what I ended up using:

- **Next.js 15** — App Router, Server Actions, Server Components
- **PostgreSQL + Prisma** — type-safe ORM with migrations
- **NextAuth.js** — authentication for the admin panel
- **Vercel Blob** — file uploads for images
- **Radix UI + Tailwind CSS** — accessible, unstyled primitives with utility classes
- **Framer Motion** — animations that feel natural

## Clean Architecture in practice

The biggest win was separating concerns properly:

\`\`\`
src/
  domain/          # entities, repository interfaces
  application/     # use cases
  infrastructure/  # prisma repositories
  app/             # next.js routes, server actions
\`\`\`

This meant when I migrated from SQLite to PostgreSQL, I only touched the infrastructure layer.

## What I learned

1. **Server Actions are a game changer** — no need for separate API routes for simple mutations
2. **Radix UI saves hours** — accessibility comes for free
3. **Ephemeral filesystems are real** — SQLite on Vercel taught me this the hard way

## What's next

I'm planning to add a full blog (you're reading it!), an analytics dashboard, and OG image generation.

If you want to check out the source code, it's on [GitHub](#).
      `.trim(),
      coverUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
      published: true,
      featured: true,
      views: 142,
      readTime: 5,
      categoryId: categoryTech.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "lessons-from-my-first-year-as-a-developer" },
    update: {},
    create: {
      slug: "lessons-from-my-first-year-as-a-developer",
      title: "Lessons from my first year as a professional developer",
      excerpt:
        "Honest reflections on what nobody tells you about transitioning from student to professional software engineer.",
      content: `
## The gap between tutorials and real work

Nothing prepares you for the moment you open a real codebase for the first time. There are no clean examples, no step-by-step instructions, and the code has been written by ten different people over five years.

Here's what I wish someone had told me before I started.

## 1. Reading code is a skill

I spent 90% of my learning time *writing* code. But on the job, I spend at least 60% of my time *reading* it. 

Learning to navigate a large codebase, understand context quickly, and identify what matters is a completely different skill that you only develop by doing it.

## 2. Communication matters as much as code

The best PR I ever submitted was rejected — not because the code was wrong, but because I hadn't explained *why* I made the choices I did.

Write PR descriptions. Add comments for non-obvious logic. Over-communicate when in doubt.

## 3. Done is better than perfect

Early on, I would refactor things endlessly before showing anyone. I learned that shipping something imperfect and iterating is almost always better than waiting for perfection.

## 4. Ask for help earlier than feels comfortable

I wasted two days on a bug that a senior dev solved in 10 minutes. The lesson wasn't that I was bad at debugging — it was that I needed to recognize when I was spinning my wheels.

## 5. Your environment matters

Invest time in your editor, your terminal, your shortcuts. The hours you put into tooling pay dividends every single day.

## Final thoughts

The first year is hard. But the growth is real. Focus on learning, stay curious, and don't compare your chapter 1 to someone else's chapter 10.
      `.trim(),
      coverUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
      published: true,
      featured: false,
      views: 89,
      readTime: 4,
      categoryId: categoryCareer.id,
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      content:
        "Excelente post! Tenho pensado em usar Clean Architecture no meu próximo projeto mas sempre achei que seria overkill para um portfolio. Você acha que vale a pena mesmo para projetos menores?",
      name: post1.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      content:
        "Boa pergunta! Para projetos pequenos pode parecer overhead, mas o benefício real aparece quando você precisa trocar algo — como eu fiz migrando de SQLite para PostgreSQL. Se você planeja manter o projeto por bastante tempo, vale muito a pena.",
      name: post1.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      content:
        "Que stack incrível! Estou aprendendo Next.js agora e esse post me ajudou a entender como organizar um projeto real. O repositório está público?",
      name: post1.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      content:
        "Sim! Você pode encontrar o link no GitHub no rodapé do portfolio. Qualquer dúvida pode abrir uma issue ou me chamar pelo LinkedIn 🙂",
      name: post1.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      content:
        "Muito bem explicado! Eu ainda uso Pages Router no trabalho, mas esse post me motivou a experimentar o App Router em projetos pessoais.",
      name: post1.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post2.id,
      content:
        "Me identifiquei demais com o ponto sobre pedir ajuda. Passei semanas travada em algo que meu tech lead resolveu em minutos. Difícil saber quando parar de tentar sozinha.",
      name: post2.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post2.id,
      content:
        "Exatamente! Uma regra que uso: se estou travado por mais de 30-40 minutos sem progresso real, é hora de pedir ajuda. Não é fraqueza — é eficiência.",
      name: post2.id + "comment",
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post2.id,
      content:
        "O ponto sobre leitura de código é subestimado demais. Todo curso ensina a escrever, ninguém ensina a ler código legado. Deveria ser uma disciplina separada.",
      name: post2.id + "comment",
    },
  });

  const ips = [
    "192.168.1.1",
    "10.0.0.2",
    "172.16.0.3",
    "192.168.2.4",
    "10.0.0.5",
    "172.16.0.6",
    "192.168.3.7",
    "10.0.0.8",
  ];

  const now = new Date();

  for (let day = 6; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    const viewsPerDay = Math.floor(Math.random() * 4) + 1;

    for (let v = 0; v < viewsPerDay; v++) {
      const ip = ips[Math.floor(Math.random() * ips.length)];

      await prisma.postView.create({
        data: {
          postId: Math.random() > 0.4 ? post1.id : post2.id,
          ip,
          createdAt: date,
        },
      });
    }
  }

  console.log("✅ Blog seed complete");
  console.log(`   📝 Posts: ${post1.title}`);
  console.log(`   📝 Posts: ${post2.title}`);
  console.log(`   🗂️  Categories: Technology, Career`);
  console.log(`   💬 Comments: 7 (with replies)`);
  console.log(`   👁️  Views: seeded for last 7 days`);
}
