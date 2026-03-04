import { getAllProjects } from "@/application/use-cases";
import { ProjectsTable } from "@/components/admin/Projects/ProjectsTable";
import { SyncButton } from "@/components/admin/SyncButton";
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage visibility, categories and images
          </p>
        </div>
        <div className="min-w-52">
          <SyncButton />
        </div>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
