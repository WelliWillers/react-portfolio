"use client";

import {
  createSkillAction,
  deleteSkillAction,
} from "@/app/admin/settings/skills/actions";
import { Skill } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { SkillEditModal } from "./SkillManagerModal";

export const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "MOBILE",
  "OUTROS",
  "TOOLS",
  "CHARACTER",
  "LANGUAGE",
] as const;

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
  category: z.enum(SKILL_CATEGORIES),
});

export type SkillFormData = z.infer<typeof skillSchema>;

function SkillLevelBar({ level }: { level: number }) {
  const colorClass =
    level < 6
      ? "from-red-600 via-rose-500 to-orange-400"
      : level <= 8
        ? "from-yellow-600 via-amber-500 to-yellow-300"
        : "from-green-600 via-emerald-500 to-teal-400";

  const textClass =
    level < 6
      ? "text-rose-400"
      : level <= 8
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
          style={{ width: `${level * 10}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${textClass}`}>{level}/10</span>
    </div>
  );
}

export function SkillsManager({ skills: initial }: { skills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Skill | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", level: 7, category: "FRONTEND" },
  });

  const levelValue = watch("level");

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

  return (
    <>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Add New Skill
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Add a skill with its proficiency level.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Skill Name"
              required
              placeholder="e.g. React"
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Category <span className="text-red-400">*</span>
              </Label.Root>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 hover:border-gray-600 transition-colors">
                      <Select.Value placeholder="Select category" />
                      <Select.Icon>
                        <ChevronDown size={14} className="text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                        <Select.Viewport className="p-1">
                          {SKILL_CATEGORIES.map((c) => (
                            <Select.Item
                              key={c}
                              value={c}
                              className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 rounded-lg cursor-pointer focus:outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-white transition-colors"
                            >
                              <Select.ItemText>{c}</Select.ItemText>
                              <Select.ItemIndicator>
                                <Check size={14} className="text-primary-400" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                )}
              />
              {errors.category && (
                <p className="text-red-400 text-xs">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Level{" "}
                <span className="text-primary-400 font-mono">
                  {levelValue}/10
                </span>
              </Label.Root>
              <input
                type="range"
                min={1}
                max={10}
                {...register("level", { valueAsNumber: true })}
                className="w-full accent-primary-500 cursor-pointer mt-1"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all ${
                    levelValue < 6
                      ? "from-red-600 via-rose-500 to-orange-400"
                      : levelValue <= 8
                        ? "from-yellow-600 via-amber-500 to-yellow-300"
                        : "from-green-600 via-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${levelValue * 10}%` }}
                />
              </div>
              {errors.level && (
                <p className="text-red-400 text-xs">{errors.level.message}</p>
              )}
            </div>
          </div>

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex justify-end">
            <Button type="submit" loading={isPending} icon={<Plus size={16} />}>
              Add Skill
            </Button>
          </div>
        </form>

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
                <tr
                  key={skill.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3 text-gray-200">{skill.name}</td>

                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700/50 text-gray-400 border border-gray-700">
                      {skill.category}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <SkillLevelBar level={skill.level} />
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={14} />}
                        onClick={() => setEditing(skill)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDelete(skill.id)}
                      />
                    </div>
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
        <SkillEditModal
          skill={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
