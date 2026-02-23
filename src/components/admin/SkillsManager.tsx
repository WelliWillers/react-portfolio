"use client";

import {
  createSkillAction,
  deleteSkillAction,
} from "@/app/admin/settings/skills/actions";
import { Skill } from "@/domain/entities";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { SkillEditModal } from "./SkillManagerModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "MOBILE",
  "OUTROS",
  "TOOLS",
  "CHARACTER",
  "LANGUAGE",
];

export const skillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must have at least 2 characters")
    .max(50, "Skill name too long"),

  level: z
    .number({
      required_error: "Level is required",
      invalid_type_error: "Level must be a number",
    })
    .min(1, "Minimum level is 1")
    .max(10, "Maximum level is 10"),

  category: z.enum(SKILL_CATEGORIES as [string, ...string[]]),
});

export type SkillFormData = z.infer<typeof skillSchema>;

export function SkillsManager({ skills: initial }: { skills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Skill | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: 7,
      category: "FRONTEND",
    },
  });

  function onSubmit(data: SkillFormData) {
    startTransition(async () => {
      await createSkillAction(data);
      toast.success("Skill added!");
      reset({ name: "", level: 7, category: "FRONTEND" });
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSkillAction(id);
      toast.success("Skill removed!");
    });
  }

  const inputClass =
    "px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm w-full";

  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <>
      <div className="space-y-6">
        {/* Add new */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Add New Skill
          </h3>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <input
                {...register("name")}
                placeholder="Skill name (e.g. React)"
                className={inputClass}
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                min={1}
                max={10}
                {...register("level", { valueAsNumber: true })}
                placeholder="Level (1-10)"
                className={inputClass}
              />
              {errors.level && (
                <p className={errorClass}>{errors.level.message}</p>
              )}
            </div>

            <div>
              <select {...register("category")} className={inputClass}>
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={errorClass}>{errors.category.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {isPending ? "Adding..." : "Add Skill"}
          </button>
        </form>

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

                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => setEditing(skill)}
                      className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil size={15} />
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

      {editing && (
        <SkillEditModal skill={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
