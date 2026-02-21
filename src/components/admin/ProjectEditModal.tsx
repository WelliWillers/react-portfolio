"use client";

import { useState, useTransition } from "react";
import { Project, ProjectCategory } from "@/domain/entities";
import { X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateProjectAction } from "@/app/admin/projects/actions";
import Image from "next/image";

const CATEGORIES = ["FRONTEND", "BACKEND", "MOBILE", "OUTROS"];

export function ProjectEditModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: project.title,
    description: project.description ?? "",
    category: project.category,
    liveUrl: project.liveUrl ?? "",
    imageUrl: project.imageUrl ?? "",
    published: project.published,
    featured: project.featured,
  });
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((f) => ({ ...f, imageUrl: data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    startTransition(async () => {
      await updateProjectAction(project.id, form);
      toast.success("Project updated!");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as ProjectCategory,
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Live URL
            </label>
            <input
              value={form.liveUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, liveUrl: e.target.value }))
              }
              placeholder="https://..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Project Image
            </label>
            {form.imageUrl && (
              <div className="relative h-32 rounded-xl overflow-hidden mb-2 border border-gray-700">
                <Image
                  src={form.imageUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-400">
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
                className="w-4 h-4 rounded accent-primary-500"
              />
              <span className="text-sm text-gray-300">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded accent-yellow-500"
              />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
