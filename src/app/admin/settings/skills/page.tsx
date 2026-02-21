import { getSkills } from "@/application/use-cases";
import { SkillsManager } from "@/components/admin/SkillsManager";
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = await getSkills();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your technical skills and proficiency levels
        </p>
      </div>
      <SkillsManager skills={skills} />
    </div>
  );
}
