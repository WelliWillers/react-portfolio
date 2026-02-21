"use client";

import {
  createSkillAction,
  deleteSkillAction,
} from "@/app/admin/settings/skills/actions";
import { Skill } from "@/domain/entities";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export function SkillsManager({ skills: initial }: { skills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 7,
    category: "TECH",
  });

  function handleAdd() {
    if (!newSkill.name.trim()) return toast.error("Name required");
    startTransition(async () => {
      await createSkillAction(newSkill);
      setNewSkill({ name: "", level: 7, category: "TECH" });
      toast.success("Skill added!");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSkillAction(id);
      toast.success("Skill removed!");
    });
  }

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Add New Skill
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            placeholder="Skill name (e.g. React)"
            value={newSkill.name}
            onChange={(e) =>
              setNewSkill((s) => ({ ...s, name: e.target.value }))
            }
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />
          <input
            type="number"
            min={1}
            max={10}
            placeholder="Level (1-10)"
            value={newSkill.level}
            onChange={(e) =>
              setNewSkill((s) => ({ ...s, level: Number(e.target.value) }))
            }
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm"
          />
          <input
            placeholder="Category (e.g. TECH)"
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill((s) => ({ ...s, category: e.target.value }))
            }
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* List */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">
                Skill
              </th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">
                Category
              </th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">
                Level
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {initial.map((skill) => (
              <tr key={skill.id} className="border-b border-gray-800/50">
                <td className="px-5 py-3 text-gray-200">{skill.name}</td>
                <td className="px-5 py-3 text-gray-400">{skill.category}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        style={{ width: `${skill.level * 10}%` }}
                      />
                    </div>
                    <span className="text-primary-400 text-xs font-mono">
                      {skill.level}/10
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!initial.length && (
          <div className="text-center py-10 text-gray-600">
            No skills added yet.
          </div>
        )}
      </div>
    </div>
  );
}
