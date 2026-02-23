import { PrismaClient } from "@prisma/client";
import { contactsSeed } from "./seeds/seed_contacts";
import { skillsSeed } from "./seeds/seed_skills";
import { userSeed } from "./seeds/seed_user";

const prisma = new PrismaClient();

async function main() {
  const seedType = process.argv[2];

  console.log("Running seed with type:", seedType);

  if (seedType === "skills") {
    return await skillsSeed();
  }

  if (seedType === "contacts") {
    return await contactsSeed();
  }

  if (seedType === "user") {
    return await userSeed();
  }

  console.log("Running full seed...");
  await userSeed();
  await skillsSeed();
  await contactsSeed();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
