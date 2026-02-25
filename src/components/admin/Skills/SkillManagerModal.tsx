"use client";

import { updateSkillAction } from "@/app/admin/settings/skills/actions";
import { Skill } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/Dialog";
import { Input } from "../../ui/Input";
import { SKILL_CATEGORIES, SkillFormData, skillSchema } from "./SkillsManager";

export function SkillEditModal({
  skill,
  open,
  onClose,
}: {
  skill: Skill;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    reset({
      name: skill.name,
      level: skill.level,
      category: skill.category as SkillFormData["category"],
    });
  }, [skill, reset]);

  const levelValue = watch("level");

  const barColor =
    levelValue < 6
      ? "from-red-600 via-rose-500 to-orange-400"
      : levelValue <= 8
        ? "from-yellow-600 via-amber-500 to-yellow-300"
        : "from-green-600 via-emerald-500 to-teal-400";

  const levelColor =
    levelValue < 6
      ? "text-rose-400"
      : levelValue <= 8
        ? "text-amber-400"
        : "text-emerald-400";

  function onSubmit(data: SkillFormData) {
    startTransition(async () => {
      await updateSkillAction(skill.id, data);
      toast.success("Skill updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
          <DialogDescription>
            Update the skill name, category and proficiency level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-5">
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

            <Separator.Root className="bg-gray-800 h-px" />

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Proficiency Level{" "}
                <span className={`font-mono font-bold ${levelColor}`}>
                  {levelValue}/10
                </span>
              </Label.Root>

              <input
                type="range"
                min={1}
                max={10}
                {...register("level", { valueAsNumber: true })}
                className="w-full accent-primary-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-gray-600">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>

              <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${barColor}`}
                  style={{ width: `${levelValue * 10}%` }}
                />
              </div>

              {errors.level && (
                <p className="text-red-400 text-xs">{errors.level.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Update Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
