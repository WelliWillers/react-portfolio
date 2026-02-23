import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function contactsSeed() {
  await prisma.contact.createMany({
    data: [
      {
        type: "github",
        label: "GitHub",
        value: "https://github.com/WelliWillers",
        url: "https://github.com/WelliWillers",
        visible: true,
      },
      {
        type: "linkedin",
        label: "Linkedin",
        value: "wellington-willers-24302b199",
        url: "https://www.linkedin.com/in/wellington-willers-24302b199/",
        visible: true,
      },
      {
        type: "phone",
        label: "Phone",
        value: "+55 (51) 992618520",
        url: "tell:5551992618520",
        visible: true,
      },
      {
        type: "email",
        label: "Email",
        value: "wellington.willers@gmail.com",
        url: "mailto:wellington.willers@gmail.com",
        visible: true,
      },
    ],
    skipDuplicates: true,
  });
}
