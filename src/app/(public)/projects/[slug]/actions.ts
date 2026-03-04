"use server";

import { prisma } from "@/lib/db/prisma";
import { headers } from "next/headers";

export async function trackProjectView(projectId: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const userAgent = headersList.get("user-agent") ?? "";

  const recentView = await prisma.projectView.findFirst({
    where: {
      projectId,
      ip,
      createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60) },
    },
  });

  if (recentView) return;

  await prisma.$transaction([
    prisma.projectView.create({
      data: { projectId, ip, userAgent },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: { views: { increment: 1 } },
    }),
  ]);
}
