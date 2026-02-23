"use client";

import { useState, useTransition } from "react";
import { Certificate } from "@/domain/entities";
import {
  Plus,
  Trash2,
  Upload,
  Loader2,
  Award,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createCertificateAction,
  deleteCertificateAction,
} from "@/app/admin/settings/certificates/actions";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  institution: z.string().min(1, "Institution is required"),
  date: z.string().optional(),
  fileUrl: z.string().optional(),
  credentialUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("http"), {
      message: "Must be a valid URL",
    }),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export function CertificatesManager({
  certificates: initial,
}: {
  certificates: Certificate[];
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      institution: "",
      date: "",
      fileUrl: "",
      credentialUrl: "",
    },
  });

  const fileUrl = watch("fileUrl");

  /* ---------------- FILE UPLOAD ---------------- */

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

      setValue("fileUrl", data.url);
      toast.success("File uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  /* ---------------- SUBMIT ---------------- */

  function onSubmit(data: CertificateFormData) {
    startTransition(async () => {
      await createCertificateAction(data);
      reset();
      toast.success("Certificate added!");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCertificateAction(id);
      toast.success("Certificate removed!");
    });
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Add Certificate
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <input
              placeholder="Title"
              {...register("title")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Institution"
              {...register("institution")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.institution && (
              <p className="text-red-400 text-xs mt-1">
                {errors.institution.message}
              </p>
            )}
          </div>

          <input
            placeholder="Date (e.g. 2024)"
            {...register("date")}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
          />

          <div>
            <input
              placeholder="Credential URL"
              {...register("credentialUrl")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.credentialUrl && (
              <p className="text-red-400 text-xs mt-1">
                {errors.credentialUrl.message}
              </p>
            )}
          </div>
        </div>

        {/* Upload */}
        <div className="mt-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-sm text-gray-400 w-fit">
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {fileUrl
              ? "File uploaded ✓"
              : "Upload certificate file (PDF/image)"}
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {isPending ? "Adding..." : "Add Certificate"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initial.map((cert) => (
          <div
            key={cert.id}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group"
          >
            <button
              onClick={() => handleDelete(cert.id)}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-primary-400" />
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm">
                  {cert.title}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {cert.institution}
                </p>

                {cert.date && (
                  <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline"
                  >
                    View <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
