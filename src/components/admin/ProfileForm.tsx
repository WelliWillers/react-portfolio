"use client";

import { updateProfileAction } from "@/app/admin/settings/profile/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Avatar from "@radix-ui/react-avatar";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import { Loader2, Save, Upload, User } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  bio: z.string().min(10, "Bio must have at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  githubUser: z
    .string()
    .min(2, "GitHub username is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid GitHub username"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Textarea({
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
        className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl text-white text-sm
          placeholder-gray-500 focus:outline-none transition-colors resize-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-primary-500"}
          ${className ?? ""}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

export function ProfileForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      title: profile?.title ?? "",
      subtitle: profile?.subtitle ?? "",
      bio: profile?.bio ?? "",
      location: profile?.location ?? "",
      githubUser: profile?.githubUser ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    },
  });

  const avatarUrl = watch("avatarUrl");

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setValue("avatarUrl", data.url);
      toast.success("Avatar uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(data: ProfileFormData) {
    startTransition(async () => {
      await updateProfileAction(data);
      toast.success("Profile updated!");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-full">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-6">
        <div>
          <Label.Root className="text-xs font-medium text-gray-400 mb-3 block">
            Profile Picture
          </Label.Root>

          <div className="flex items-center gap-5">
            <Avatar.Root className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-700 flex-shrink-0 bg-gray-800">
              <Avatar.Image
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <Avatar.Fallback className="w-full h-full flex items-center justify-center text-gray-500">
                <User size={28} />
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="flex flex-col gap-2">
              <label
                className={`flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed rounded-xl cursor-pointer transition-colors text-sm w-fit
                ${
                  avatarUrl
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
                  : avatarUrl
                    ? "Change avatar"
                    : "Upload avatar"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-600">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <Separator.Root className="bg-gray-800 h-px" />

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Identity
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="Your Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Title / Role"
              required
              placeholder="Full Stack Developer"
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="Location"
              required
              placeholder="City, Country"
              error={errors.location?.message}
              {...register("location")}
            />
            <Input
              label="GitHub Username"
              required
              placeholder="your-username"
              hint="Used to sync your repositories"
              error={errors.githubUser?.message}
              {...register("githubUser")}
            />
          </div>
        </div>

        <Separator.Root className="bg-gray-800 h-px" />

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            About
          </p>
          <div className="space-y-4">
            <Textarea
              label="Subtitle"
              placeholder="e.g. Passionate about building great products"
              hint="Short tagline shown below your name"
              error={errors.subtitle?.message}
              rows={2}
              {...register("subtitle")}
            />
            <Textarea
              label="Bio"
              required
              placeholder="A short description about yourself..."
              hint="Shown in the About section of your portfolio"
              error={errors.bio?.message}
              rows={4}
              {...register("bio")}
            />
          </div>
        </div>

        <Separator.Root className="bg-gray-800 h-px" />

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isPending}
            disabled={uploading}
            icon={<Save size={16} />}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </form>
  );
}
