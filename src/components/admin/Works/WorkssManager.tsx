"use client";

import {
  createWorkAction,
  deleteWorkAction,
} from "@/app/admin/settings/works/actions";
import { Work } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { WorkManagerModal } from "./WorkManagerModal";

export const workSchema = z
  .object({
    title: z.string().min(2).max(60),
    company: z.string().min(2).max(60),
    description: z.string().min(10).max(300),
    isCurrent: z.boolean().optional(),
    startDate: z.coerce.date({ required_error: "Start date is required" }),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && !data.endDate) return false;
      return true;
    },
    {
      message: "End date is required when not current",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (data.endDate && data.startDate && data.endDate <= data.startDate)
        return false;
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type WorkFormData = z.infer<typeof workSchema>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label.Root
          htmlFor={inputId}
          className="text-xs font-medium text-gray-400"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </Label.Root>
      )}
      <textarea
        id={inputId}
        aria-invalid={!!error}
        className={`w-full px-4 py-2 bg-gray-800 border rounded-xl text-white text-sm
          placeholder-gray-500 focus:outline-none transition-colors resize-none
          ${error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-primary-500"}
          ${className ?? ""}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

// Gera lista de meses: "Jan 2020", "Feb 2020" ... até hoje
function generateMonthOptions() {
  const options: { label: string; value: string }[] = [];
  const now = new Date();
  const start = new Date(2000, 0);

  while (start <= now) {
    const label = start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const value = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    options.push({ label, value });
    start.setMonth(start.getMonth() + 1);
  }

  return options.reverse(); // mais recente primeiro
}

const MONTH_OPTIONS = generateMonthOptions();

function MonthSelect({
  label,
  value,
  onChange,
  error,
  required,
  placeholder = "Select month",
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label.Root className="text-xs font-medium text-gray-400">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </Label.Root>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 bg-gray-800 border rounded-xl text-white text-sm
          focus:outline-none transition-colors appearance-none cursor-pointer
          ${error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-primary-500"}
          ${!value ? "text-gray-500" : "text-white"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {MONTH_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function formatDate(date?: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function sortWorks(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
}

export function WorksManager({ works: initial }: { works: Work[] }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Work | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      isCurrent: false,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const isCurrent = watch("isCurrent");

  function onSubmit(data: WorkFormData) {
    startTransition(async () => {
      await createWorkAction(data);
      toast.success("Work added!");
      reset();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteWorkAction(id);
      toast.success("Work removed!");
    });
  }

  const sorted = sortWorks(initial);

  return (
    <>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Add Work Experience
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Add a position or role to your work history.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="space-y-4">
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
                placeholder={isCurrent ? "Present" : undefined}
                error={errors.endDate?.message}
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

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex justify-end">
            <Button type="submit" loading={isPending} icon={<Plus size={16} />}>
              Add Work
            </Button>
          </div>
        </form>

        {sorted.length === 0 ? (
          <div className="text-center py-10 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            No work experience added yet.
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
            {sorted.map((work, i) => (
              <div
                key={work.id}
                className="flex items-start gap-4 p-5 group hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      work.isCurrent
                        ? "bg-primary-500 border-primary-400"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  />
                  {i < sorted.length - 1 && (
                    <div className="w-px flex-1 bg-gray-800 mt-1 min-h-[24px]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">
                          {work.title}
                        </span>
                        {work.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Briefcase size={11} className="text-gray-500" />
                        <span className="text-gray-400 text-xs">
                          {work.company}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-gray-500 shrink-0 font-mono">
                      {formatDate(work.startDate)}
                      {" → "}
                      {work.isCurrent ? (
                        <span className="text-primary-400">Present</span>
                      ) : (
                        (formatDate(work.endDate) ?? "—")
                      )}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {work.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Pencil size={13} />}
                    onClick={() => setEditing(work)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={13} />}
                    onClick={() => handleDelete(work.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <WorkManagerModal
          work={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
