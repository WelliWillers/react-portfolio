'use client'

import { useState, useTransition } from 'react'
import { Profile } from '@/domain/entities'
import { Save, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { updateProfileAction } from '@/app/admin/settings/profile/actions'

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    title: profile?.title ?? '',
    bio: profile?.bio ?? '',
    location: profile?.location ?? '',
    githubUser: profile?.githubUser ?? '',
    avatarUrl: profile?.avatarUrl ?? '',
  })

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setForm((f) => ({ ...f, avatarUrl: data.url }))
      toast.success('Avatar uploaded!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleSave() {
    startTransition(async () => {
      await updateProfileAction(form)
      toast.success('Profile updated!')
    })
  }

  const inputClass = "w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"

  return (
    <div className="max-w-2xl">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {form.avatarUrl ? (
              <Image src={form.avatarUrl} alt="avatar" width={80} height={80} className="rounded-2xl object-cover border border-gray-700" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500">
                👤
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-400">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload avatar'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Title / Role</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Full Stack Developer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="City, Country" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub Username</label>
            <input className={inputClass} value={form.githubUser} onChange={(e) => setForm((f) => ({ ...f, githubUser: e.target.value }))} placeholder="your-username" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
          <textarea
            rows={4}
            className={`${inputClass} resize-none`}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A short description about yourself..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
