"use client";

import {
  createServiceAction,
  deleteServiceAction,
} from "@/app/admin/settings/services/actions";
import { Service } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import { Check, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ServiceManagerModal } from "./ServiceManagerModal";

export const serviceSchema = z.object({
  title: z
    .string()
    .min(2, "Title must have at least 2 characters")
    .max(60, "Title too long"),
  description: z
    .string()
    .min(10, "Description must have at least 10 characters")
    .max(300, "Description too long"),
  icon: z.string().max(30, "Icon key too long").optional().or(z.literal("")),
  highlights: z
    .array(z.object({ value: z.string().min(1, "Cannot be empty") }))
    .optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const ICON_OPTIONS = [
  "frontend",
  "backend",
  "mobile",
  "layers",
  "code",
  "wrench",
];

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

export function ServicesManager({
  services: initial,
}: {
  services: Service[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      highlights: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  function onSubmit(data: ServiceFormData) {
    startTransition(async () => {
      await createServiceAction(data);
      toast.success("Service added!");
      reset();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteServiceAction(id);
      toast.success("Service removed!");
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
            Add New Service
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Describe a service or expertise you offer.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="space-y-4">
            <Input
              label="Title"
              required
              placeholder="e.g. Frontend Development"
              error={errors.title?.message}
              {...register("title")}
            />

            <Textarea
              label="Description"
              required
              rows={3}
              placeholder="Describe the service you offer..."
              error={errors.description?.message}
              {...register("description")}
            />

            <div className="pb-4">
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 hover:border-gray-600 transition-colors w-full">
                      <Select.Value placeholder="Select icon" />
                      <Select.Icon>
                        <ChevronDown size={14} className="text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                        <Select.Viewport className="p-1">
                          {ICON_OPTIONS.map((c) => (
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
            </div>
          </div>

          <Separator.Root className="bg-gray-800 h-px" />

          <div className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between">
              <Label.Root className="text-xs font-medium text-gray-400">
                Highlights
              </Label.Root>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<Plus size={13} />}
                onClick={() => append({ value: "" })}
              >
                Add item
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-gray-600 py-2">
                No highlights added. Click "Add item" to add bullet points to
                this service.
              </p>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`highlights.${index}.value`)}
                    placeholder={`e.g. Responsive design`}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {errors.highlights && (
                <p className="text-xs text-red-400">
                  {errors.highlights.message}
                </p>
              )}
            </div>
          </div>

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex justify-end">
            <Button type="submit" loading={isPending} icon={<Plus size={16} />}>
              Add Service
            </Button>
          </div>
        </form>

        {initial.length === 0 ? (
          <div className="text-center py-10 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
            No services added yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {initial.map((service) => (
              <div
                key={service.id}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {service.icon && (
                        <span className="px-2 py-0.5 rounded-lg text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono">
                          {service.icon}
                        </span>
                      )}
                      <h3 className="text-white font-semibold text-sm truncate">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {(service as any).highlights?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {(service as any).highlights.map(
                          (h: { value: string }, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-1.5 text-xs text-gray-500"
                            >
                              <span className="w-1 h-1 rounded-full bg-primary-500/50 shrink-0" />
                              {h.value}
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      icon={<Pencil size={14} />}
                      onClick={() => setEditing(service)}
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={13} />}
                      onClick={() => handleDelete(service.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <ServiceManagerModal
          service={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
