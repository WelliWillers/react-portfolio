import { getProfile } from '@/application/use-cases'
import { ProfileForm } from '@/components/admin/ProfileForm'

export default async function ProfileSettingsPage() {
  const profile = await getProfile()
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your public profile information</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
