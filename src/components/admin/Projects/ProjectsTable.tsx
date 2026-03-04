"use client";

import { updateProjectAction } from "@/app/admin/projects/actions";
import { Project } from "@/domain/entities";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Search,
  Star,
} from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../../ui/Button";
import { ProjectEditModal } from "./ProjectEditModal";

const PAGE_SIZE = 10;

function TooltipButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button onClick={onClick} className={className}>
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg shadow-lg"
            sideOffset={5}
          >
            {label}
            <Tooltip.Arrow className="fill-gray-700" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [, startTransition] = useTransition();
  const [editing, setEditing] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function togglePublished(project: Project) {
    startTransition(async () => {
      await updateProjectAction(project.id, { published: !project.published });
      toast.success(project.published ? "Hidden from public" : "Now public!");
    });
  }

  function toggleFeatured(project: Project) {
    startTransition(async () => {
      await updateProjectAction(project.id, { featured: !project.featured });
      toast.success(
        project.featured ? "Removed from featured" : "Added to featured!",
      );
    });
  }

  return (
    <>
      <div className="mb-4 relative w-full gap-4 flex justify-between items-center">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm transition-colors"
        />
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Title
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">
                  Language
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Views
                </th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-600">
                    No projects found.
                  </td>
                </tr>
              )}

              {paginated.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="text-gray-200 font-medium">
                      {project.title}
                    </div>
                    {project.description && (
                      <div className="text-gray-500 text-xs truncate max-w-[200px]">
                        {project.description}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                    {project.language ?? "—"}
                  </td>

                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {project.category}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 ">
                      {project.views} view
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        project.published
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-gray-700/50 text-gray-500 border border-gray-700"
                      }`}
                    >
                      {project.published ? "Public" : "Draft"}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipButton
                        label={project.published ? "Hide" : "Publish"}
                        onClick={() => togglePublished(project)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        {project.published ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </TooltipButton>

                      <TooltipButton
                        label={project.featured ? "Unfeature" : "Feature"}
                        onClick={() => toggleFeatured(project)}
                        className={`p-1.5 rounded-lg hover:bg-gray-700 transition-colors ${
                          project.featured
                            ? "text-yellow-400"
                            : "text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <Star size={15} />
                      </TooltipButton>

                      <TooltipButton
                        label="Edit"
                        onClick={() => setEditing(project)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <Pencil size={15} />
                      </TooltipButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="text-gray-300 font-medium">
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="text-gray-300 font-medium">
                {filtered.length}
              </span>{" "}
              projects
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronLeft size={15} />}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? "bg-primary-600 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronRight size={15} />}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </div>
          </div>
        )}
      </div>

      {editing && (
        <ProjectEditModal
          project={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
