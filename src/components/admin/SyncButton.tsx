"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";

export function SyncButton() {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Synced ${data.synced} of ${data.total} repos!`);
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={loading}
      variant="primary"
      icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white w-full rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
    >
      {loading ? "Syncing..." : "Sync GitHub"}
    </Button>
  );
}
