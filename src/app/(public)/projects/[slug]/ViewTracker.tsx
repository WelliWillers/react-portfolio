"use client";

import { useEffect } from "react";
import { trackProjectView } from "./actions";
import { useSession } from "next-auth/react";

export function ViewTracker({ projectId }: { projectId: string }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) return;

    trackProjectView(projectId);
  }, [projectId, status]);

  return null;
}
