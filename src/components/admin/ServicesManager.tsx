'use client'

import { useState, useTransition } from 'react'
import { Service } from '@/domain/entities'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createServiceAction, deleteServiceAction } from '@/app/admin/settings/services/actions'

export function ServicesManager({ services: initial }: { services: Service[] }) {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ title: '', description: '', icon: '' })

  function handleAdd() {
    if (!form.title || !form.description) return toast.error('Title and description required')
    startTransition(async () => {
      await createServiceAction(form)
      setForm({ title: '', description: '', icon: '' })
      toast.success('Service added!')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteServiceAction(id)
      toast.success('Service removed!')
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Add New Service</h3>
        <div className="space-y-3">
          <input
            placeholder="Service title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />
          <textarea
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm resize-none"
          />
          <input
            placeholder="Icon key (frontend, backend, mobile, code...)"
            value={form.icon}
            onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {initial.map((service) => (
          <div key={service.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group">
            <button
              onClick={() => handleDelete(service.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
            <h3 className="text-white font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-400 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
      {!initial.length && (
        <div className="text-center py-10 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">No services added yet.</div>
      )}
    </div>
  )
}
