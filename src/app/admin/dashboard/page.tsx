import { getAllProjects, getSkills, getServices, getCertificates, getContacts } from '@/application/use-cases'
import { FolderOpen, Cpu, Wrench, Award, Phone, RefreshCw } from 'lucide-react'
import { SyncButton } from '@/components/admin/SyncButton'

export default async function DashboardPage() {
  const [projects, skills, services, certificates, contacts] = await Promise.all([
    getAllProjects(),
    getSkills(),
    getServices(),
    getCertificates(),
    getContacts(),
  ])

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Published', value: projects.filter((p) => p.published).length, icon: FolderOpen, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Skills', value: skills.length, icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Services', value: services.length, icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Certificates', value: certificates.length, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Contacts', value: contacts.length, icon: Phone, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your portfolio</p>
        </div>
        <SyncButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Projects</h2>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 8).map((p) => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-gray-300">{p.title}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700/50 text-gray-500 border border-gray-700'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
