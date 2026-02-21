import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
