"use client";

import { useEffect } from "react";
import { trackProjectView } from "./actions";
import { useSession } from "next-auth/react";

export function ViewTracker({ projectId }: { projectId: string }) {
  const session = useSession();

  useEffect(() => {
    if (!!session.data?.user) {
      trackProjectView(projectId);
    }
  }, [projectId, session]);

  return null;
}
