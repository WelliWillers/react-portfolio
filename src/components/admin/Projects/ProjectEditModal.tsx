"use client";

import { updateProjectAction } from "@/app/admin/projects/actions";
import { Project } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
import { Check, ChevronDown, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
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

const CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "MOBILE",
  "FULLSTACK",
  "OUTROS",
] as const;

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  liveUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("http"), {
      message: "Must be a valid URL",
    }),
  imageUrl: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

function Textarea({
  label,
  error,
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
    </div>
  );
}

export function ProjectEditModal({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description ?? "",
      category: project.category as (typeof CATEGORIES)[number],
      liveUrl: project.liveUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      published: project.published,
      featured: project.featured,
    },
  });

  const imageUrl = watch("imageUrl");
  const published = watch("published");
  const featured = watch("featured");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setValue("imageUrl", data.url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(data: ProjectFormData) {
    startTransition(async () => {
      await updateProjectAction(project.id, data);
      toast.success("Project updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="">
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details, category and visibility.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <Input
              label="Title"
              required
              placeholder="Project name"
              error={errors.title?.message}
              {...register("title")}
            />

            <Textarea
              label="Description"
              placeholder="A short description of the project..."
              rows={3}
              error={errors.description?.message}
              {...register("description")}
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
                          {CATEGORIES.map((c) => (
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
                <p className="text-xs text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <Input
              label="Live URL"
              placeholder="https://..."
              error={errors.liveUrl?.message}
              {...register("liveUrl")}
            />

            <Separator.Root className="bg-gray-800 h-px" />

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Project Image
              </Label.Root>

              {imageUrl && (
                <div className="relative h-36 rounded-xl overflow-hidden border border-gray-700">
                  <Image
                    src={imageUrl}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <label
                className={`flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-dashed rounded-xl cursor-pointer transition-colors text-sm w-fit
                ${
                  imageUrl
                    ? "border-green-500/50 text-green-400"
                    : "border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-400"
                }`}
              >
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {uploading
                  ? "Uploading..."
                  : imageUrl
                    ? "Change image"
                    : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <Separator.Root className="bg-gray-800 h-px" />

            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-1.5">
                <Label.Root className="text-xs font-medium text-gray-400">
                  Published
                </Label.Root>
                <div className="flex items-center gap-2">
                  <Switch.Root
                    checked={published}
                    onCheckedChange={(val) => setValue("published", val)}
                    className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                  <span className="text-sm text-gray-400">
                    {published ? "Visible" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label.Root className="text-xs font-medium text-gray-400">
                  Featured
                </Label.Root>
                <div className="flex items-center gap-2">
                  <Switch.Root
                    checked={featured}
                    onCheckedChange={(val) => setValue("featured", val)}
                    className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 cursor-pointer"
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                  <span className="text-sm text-gray-400">
                    {featured ? "Featured" : "Normal"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending} disabled={uploading}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
