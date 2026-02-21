'use client'

import { useState, useTransition } from 'react'
import { Certificate } from '@/domain/entities'
import { Plus, Trash2, Upload, Loader2, Award, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { createCertificateAction, deleteCertificateAction } from '@/app/admin/settings/certificates/actions'

export function CertificatesManager({ certificates: initial }: { certificates: Certificate[] }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', institution: '', date: '', fileUrl: '', credentialUrl: '' })

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setForm((f) => ({ ...f, fileUrl: data.url }))
      toast.success('File uploaded!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleAdd() {
    if (!form.title || !form.institution) return toast.error('Title and institution required')
    startTransition(async () => {
      await createCertificateAction(form)
      setForm({ title: '', institution: '', date: '', fileUrl: '', credentialUrl: '' })
      toast.success('Certificate added!')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCertificateAction(id)
      toast.success('Certificate removed!')
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Add Certificate</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
          <input placeholder="Institution" value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
          <input placeholder="Date (e.g. 2024)" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
          <input placeholder="Credential URL" value={form.credentialUrl} onChange={(e) => setForm((f) => ({ ...f, credentialUrl: e.target.value }))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm" />
        </div>
        <div className="mt-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-400 w-fit">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {form.fileUrl ? 'File uploaded ✓' : 'Upload certificate file (PDF/image)'}
            <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
        <button onClick={handleAdd} disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initial.map((cert) => (
          <div key={cert.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group">
            <button onClick={() => handleDelete(cert.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{cert.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{cert.institution}</p>
                {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline">
                    View <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
