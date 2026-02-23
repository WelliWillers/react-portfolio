"use client";

import { useState, useTransition } from "react";
import { Service } from "@/domain/entities";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  createServiceAction,
  deleteServiceAction,
} from "@/app/admin/settings/services/actions";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export function ServicesManager({
  services: initial,
}: {
  services: Service[];
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
    },
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

  const inputClass =
    "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm";

  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="space-y-6">
      {/* Add New Service */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Add New Service
        </h3>

        <div className="space-y-3">
          <div>
            <input
              {...register("title")}
              placeholder="Service title"
              className={inputClass}
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Description"
              className={`${inputClass} resize-none`}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("icon")}
              placeholder="Icon key (frontend, backend, mobile, code...)"
              className={inputClass}
            />
            {errors.icon && <p className={errorClass}>{errors.icon.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {isPending ? "Adding..." : "Add Service"}
        </button>
      </form>

      {/* List Services */}
      <div className="grid sm:grid-cols-2 gap-4">
        {initial.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group"
          >
            <button
              type="button"
              onClick={() => handleDelete(service.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>

            <h3 className="text-white font-semibold mb-2">{service.title}</h3>

            <p className="text-gray-400 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {!initial.length && (
        <div className="text-center py-10 text-gray-600 bg-gray-900 rounded-2xl border border-gray-800">
          No services added yet.
        </div>
      )}
    </div>
  );
}
