import { getWorks } from "@/application/use-cases";
import { WorksManager } from "@/components/admin/Works/WorkssManager";
export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const works = await getWorks();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Works</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your work experiences
        </p>
      </div>
      <WorksManager works={works} />
    </div>
  );
}
