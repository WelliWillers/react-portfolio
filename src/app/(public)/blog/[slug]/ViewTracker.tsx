"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { trackPostViewAction } from "./actions";

export function PostViewTracker({ postId }: { postId: string }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) return;
    trackPostViewAction(postId);
  }, [postId, status]);

  return null;
}
