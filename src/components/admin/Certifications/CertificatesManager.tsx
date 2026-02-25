"use client";

import {
  createCertificateAction,
  deleteCertificateAction,
} from "@/app/admin/settings/certificates/actions";
import { Certificate } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import {
  Award,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { CertificatesManagerModal } from "./CertificatesManagerModal";

export const certificateSchema = z.object({
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

export type CertificateFormData = z.infer<typeof certificateSchema>;

export function CertificatesManager({
  certificates: initial,
}: {
  certificates: Certificate[];
}) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);

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

  return (
    <>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Add Certificate
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Fill in the details of your certificate or qualification.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              required
              placeholder="e.g. AWS Solutions Architect"
              error={errors.title?.message}
              {...register("title")}
            />

            <Input
              label="Institution"
              required
              placeholder="e.g. Amazon Web Services"
              error={errors.institution?.message}
              {...register("institution")}
            />

            <Input label="Date" placeholder="e.g. 2024" {...register("date")} />

            <Input
              label="Credential URL"
              placeholder="https://..."
              hint="Link to verify the credential"
              error={errors.credentialUrl?.message}
              {...register("credentialUrl")}
            />
          </div>

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex flex-col gap-1.5">
            <Label.Root className="text-xs font-medium text-gray-400">
              Certificate File
            </Label.Root>
            <label
              className={`flex items-center gap-2 px-4 py-3 bg-gray-800 border border-dashed rounded-xl cursor-pointer transition-colors text-sm w-fit ${
                fileUrl
                  ? "border-green-500/50 text-green-400"
                  : "border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-400"
              }`}
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : fileUrl ? (
                <span>✓</span>
              ) : (
                <Upload size={14} />
              )}
              {uploading
                ? "Uploading..."
                : fileUrl
                  ? "File uploaded successfully"
                  : "Upload certificate file (PDF/image)"}
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-600">
              Accepted formats: PDF, PNG, JPG
            </p>
          </div>

          <div className="flex items-center justify-end mt-5 pt-5 border-t border-gray-800">
            <Button
              type="submit"
              disabled={isPending || uploading}
              size="md"
              icon={<Plus size={16} />}
              variant="primary"
            >
              {isPending ? "Adding..." : "Add Certificate"}
            </Button>
          </div>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {initial.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-5 relative group"
            >
              <div className="flex items-center justify-end gap-2 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Pencil size={14} />}
                  onClick={() => setEditing(cert)}
                />
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  onClick={() => handleDelete(cert.id)}
                />
              </div>

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
                  <div className="flex items-start gap-3">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline"
                      >
                        View external certificate <ExternalLink size={10} />
                      </a>
                    )}

                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline"
                      >
                        View file <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <CertificatesManagerModal
          certificate={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
