"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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
    <button
      onClick={handleSync}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
    >
      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      {loading ? "Syncing..." : "Sync GitHub"}
    </button>
  );
}
