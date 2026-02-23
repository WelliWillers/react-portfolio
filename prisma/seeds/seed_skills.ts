import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function skillsSeed() {
  await prisma.skill.createMany({
    data: [
      {
        name: "HTML",
        level: 10,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "CSS",
        level: 10,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "JAVASCRIPT",
        level: 9,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "REACT.JS",
        level: 10,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "Next.js",
        level: 9,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "VUE.JS",
        level: 7,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "NUXT.JS",
        level: 7,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "WORDPRESS",
        level: 8,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "Tailwind",
        level: 10,
        category: "FRONTEND",
        icon: null,
      },
      {
        name: "REACT NATIVE",
        level: 9,
        category: "MOBILE",
        icon: null,
      },
      {
        name: "FLUTTER",
        level: 4,
        category: "MOBILE",
        icon: null,
      },
      {
        name: "PHP",
        level: 6,
        category: "BACKEND",
        icon: null,
      },
      {
        name: "MySql",
        level: 7,
        category: "BACKEND",
        icon: null,
      },
      {
        name: "Firebase",
        level: 9,
        category: "BACKEND",
        icon: null,
      },
      {
        name: "NODE JS",
        level: 8,
        category: "BACKEND",
        icon: null,
      },
      {
        name: "Docker",
        level: 7,
        category: "BACKEND",
        icon: null,
      },
      {
        name: "Figma",
        level: 9,
        category: "TOOLS",
        icon: null,
      },
      {
        name: "VScode",
        level: 9,
        category: "TOOLS",
        icon: null,
      },
      {
        name: "GitHub",
        level: 9,
        category: "TOOLS",
        icon: null,
      },
      {
        name: "Inglish",
        level: 8,
        category: "LANGUAGE",
        icon: null,
      },
      {
        name: "Spanish",
        level: 6,
        category: "LANGUAGE",
        icon: null,
      },
      {
        name: "Portuguese",
        level: 10,
        category: "LANGUAGE",
        icon: null,
      },
      {
        name: "Communicative",
        level: 10,
        category: "CHARACTER",
        icon: null,
      },
      {
        name: "Attentive",
        level: 9,
        category: "CHARACTER",
        icon: null,
      },
      {
        name: "Didactic",
        level: 10,
        category: "CHARACTER",
        icon: null,
      },
      {
        name: "Agile methodologies",
        level: 10,
        category: "TOOLS",
        icon: null,
      },
    ],
    skipDuplicates: true,
  });
}
