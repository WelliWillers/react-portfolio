"use client";

import { updateServiceAction } from "@/app/admin/settings/services/actions";
import { Service } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import {
  ICON_OPTIONS,
  ServiceFormData,
  serviceSchema,
  Textarea,
} from "./ServicesManager";

export function ServiceManagerModal({
  service: initial,
  open,
  onClose,
}: {
  service: Service;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
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

  useEffect(() => {
    reset({
      title: initial.title,
      description: initial.description || "",
      icon: initial.icon || "",
      highlights: initial.highlights || [],
    });
  }, [initial, reset]);

  function onSubmit(data: ServiceFormData) {
    startTransition(async () => {
      await updateServiceAction(initial.id, data);
      toast.success("Service updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update the details of your Service or qualification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
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

          <div className="flex flex-col gap-2 p-6">
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
                <div key={field.id} className="flex items-end gap-2 w-full">
                  <Input
                    label="Title"
                    required
                    className="w-full"
                    placeholder="e.g. Responsive design"
                    error={errors.highlights?.[index]?.value?.message}
                    {...register(`highlights.${index}.value`)}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="lg"
                    className="w-fit"
                    icon={<Trash2 size={13} />}
                    onClick={() => remove(index)}
                  />
                </div>
              ))}
              {errors.highlights && (
                <p className="text-xs text-red-400">
                  {errors.highlights.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending} disabled={uploading}>
              Update Service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
