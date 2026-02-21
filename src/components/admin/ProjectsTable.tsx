'use client'

import { useState, useTransition } from 'react'
import { Project } from '@/domain/entities'
import { Eye, EyeOff, Star, Pencil, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProjectAction } from '@/app/admin/projects/actions'
import { ProjectEditModal } from './ProjectEditModal'

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<Project | null>(null)
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  function togglePublished(project: Project) {
    startTransition(async () => {
      await updateProjectAction(project.id, { published: !project.published })
      toast.success(project.published ? 'Hidden from public' : 'Now public!')
    })
  }

  function toggleFeatured(project: Project) {
    startTransition(async () => {
      await updateProjectAction(project.id, { featured: !project.featured })
      toast.success(project.featured ? 'Removed from featured' : 'Added to featured!')
    })
  }

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
        />
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Language</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="text-gray-200 font-medium">{project.title}</div>
                    {project.description && (
                      <div className="text-gray-500 text-xs truncate max-w-[200px]">{project.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{project.language ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${project.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700/50 text-gray-500 border border-gray-700'}`}>
                      {project.published ? 'Public' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublished(project)}
                        title={project.published ? 'Hide' : 'Publish'}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        {project.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(project)}
                        title={project.featured ? 'Unfeature' : 'Feature'}
                        className={`p-1.5 rounded-lg hover:bg-gray-700 transition-colors ${project.featured ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                      >
                        <Star size={15} />
                      </button>
                      <button
                        onClick={() => setEditing(project)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProjectEditModal
          project={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
