"use client";

import { updateWorkAction } from "@/app/admin/settings/works/actions";
import { Work } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
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
import { Textarea, WorkFormData, workSchema } from "./WorkssManager";

function toMonthValue(date?: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function WorkManagerModal({
  work: initial,
  open,
  onClose,
}: {
  work: Work;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      isCurrent: false,
      startDate: undefined,
      endDate: undefined,
    },
  });

  useEffect(() => {
    reset({
      title: initial.title,
      company: initial.company ?? "",
      description: initial.description ?? "",
      isCurrent: initial.isCurrent ?? false,
      startDate: toMonthValue(initial.startDate) as unknown as Date,
      endDate: initial.isCurrent
        ? undefined
        : (toMonthValue(initial.endDate) as unknown as Date | undefined),
    });
  }, [initial, reset]);

  const isCurrent = watch("isCurrent");

  function onSubmit(data: WorkFormData) {
    startTransition(async () => {
      await updateWorkAction(initial.id, data);
      toast.success("Work updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Work Experience</DialogTitle>
          <DialogDescription>
            Update the details of your position.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                required
                placeholder="e.g. Frontend Developer"
                error={errors.title?.message}
                {...register("title")}
              />
              <Input
                label="Company"
                required
                placeholder="e.g. Acme Corp"
                error={errors.company?.message}
                {...register("company")}
              />
            </div>

            <Textarea
              label="Description"
              required
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              error={errors.description?.message}
              {...register("description")}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                required
                type="month"
                error={errors.startDate?.message}
                {...register("startDate")}
              />
              <Input
                label="End Date"
                type="month"
                disabled={isCurrent}
                error={isCurrent ? undefined : errors.endDate?.message}
                {...register("endDate")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Currently working here
              </Label.Root>
              <Controller
                name="isCurrent"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch.Root
                      checked={field.value ?? false}
                      onCheckedChange={(val) => {
                        field.onChange(val);
                        if (val) setValue("endDate", undefined);
                      }}
                      className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-primary-600 focus:outline-none cursor-pointer"
                    >
                      <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
                    </Switch.Root>
                    <span className="text-sm text-gray-400">
                      {field.value
                        ? "Yes, this is my current job"
                        : "No, I've left this position"}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          <Separator.Root className="bg-gray-800 h-px shrink-0" />

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Update Work
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
