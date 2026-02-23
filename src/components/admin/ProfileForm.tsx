"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updateProfileAction } from "@/app/admin/settings/profile/actions";
import { z } from "zod";

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

export function ProfileForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
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

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

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

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm";

  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-full">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="avatar"
                width={80}
                height={80}
                className="rounded-2xl object-cover border border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500">
                <User size={24} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-400">
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Uploading..." : "Upload avatar"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Grid Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Full Name
            </label>
            <input
              {...register("name")}
              className={inputClass}
              placeholder="Your Name"
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Title / Role
            </label>
            <input
              {...register("title")}
              className={inputClass}
              placeholder="Full Stack Developer"
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Location
            </label>
            <input
              {...register("location")}
              className={inputClass}
              placeholder="City, Country"
            />
            {errors.location && (
              <p className={errorClass}>{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              GitHub Username
            </label>
            <input
              {...register("githubUser")}
              className={inputClass}
              placeholder="your-username"
            />
            {errors.githubUser && (
              <p className={errorClass}>{errors.githubUser.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Subtitle
          </label>
          <textarea
            {...register("subtitle")}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="A short description about yourself..."
          />
          {errors.subtitle && (
            <p className={errorClass}>{errors.subtitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="A short description about yourself..."
          />
          {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
