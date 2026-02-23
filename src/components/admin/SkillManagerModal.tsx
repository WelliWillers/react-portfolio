import {
  createSkillAction,
  updateSkillAction,
} from "@/app/admin/settings/skills/actions";
import { Skill } from "@/domain/entities";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { SKILL_CATEGORIES, SkillFormData, skillSchema } from "./SkillsManager";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function SkillEditModal({
  skill,
  onClose,
}: {
  skill: Skill;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: skill.name,
    level: skill.level,
    category: skill.category,
  });

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

  const inputClass =
    "px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm w-full";

  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Edit Skill</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl p-5"
        >
          <div className=" space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Skill Name
              </label>
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
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Category
              </label>
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

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Level:{" "}
                <span className="text-primary-400 font-mono">
                  {form.level}/10
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                {...register("level", { valueAsNumber: true })}
                className="w-full accent-primary-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
              <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${
                    form.level < 6
                      ? "from-red-600 via-rose-500 to-orange-400"
                      : form.level <= 8
                        ? "from-yellow-600 via-amber-500 to-yellow-300"
                        : "from-green-600 via-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${form.level * 10}%` }}
                />
              </div>

              {errors.level && (
                <p className={errorClass}>{errors.level.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
