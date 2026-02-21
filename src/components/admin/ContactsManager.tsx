'use client'

import { useState, useTransition } from 'react'
import { Contact } from '@/domain/entities'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { createContactAction, deleteContactAction, updateContactAction } from '@/app/admin/settings/contacts/actions'

const TYPES = ['email', 'github', 'linkedin', 'website', 'phone', 'twitter', 'other']

export function ContactsManager({ contacts: initial }: { contacts: Contact[] }) {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ type: 'email', label: '', value: '', url: '', visible: true })

  function handleAdd() {
    if (!form.label || !form.value) return toast.error('Label and value required')
    startTransition(async () => {
      await createContactAction(form)
      setForm({ type: 'email', label: '', value: '', url: '', visible: true })
      toast.success('Contact added!')
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Add Contact</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="Label (e.g. Email)" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
          <input placeholder="Value (e.g. you@email.com)" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
          <input placeholder="URL (optional)" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
        </div>
        <button onClick={handleAdd} disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Type</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Label</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Value</th>
              <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-800/50">
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {contact.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-300">{contact.label}</td>
                <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{contact.value}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        startTransition(async () => {
                          await updateContactAction(contact.id, { visible: !contact.visible })
                          toast.success('Updated!')
                        })
                      }}
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
                      {contact.visible ? <Eye size={14} className="text-green-400" /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => {
                      startTransition(async () => {
                        await deleteContactAction(contact.id)
                        toast.success('Removed!')
                      })
                    }} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!initial.length && <div className="text-center py-10 text-gray-600">No contacts added yet.</div>}
      </div>
    </div>
  )
}
