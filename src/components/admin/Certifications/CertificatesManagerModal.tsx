"use client";

import { updateCertificateAction } from "@/app/admin/settings/certificates/actions";
import { Certificate } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { CertificateFormData, certificateSchema } from "./CertificatesManager";

export function CertificatesManagerModal({
  certificate: initial,
  open,
  onClose,
}: {
  certificate: Certificate;
  open: boolean;
  onClose: () => void;
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

  useEffect(() => {
    reset({
      title: initial.title,
      institution: initial.institution,
      date: initial.date ?? "",
      fileUrl: initial.fileUrl ?? "",
      credentialUrl: initial.credentialUrl ?? "",
    });
  }, [initial, reset]);

  const fileUrl = watch("fileUrl");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
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
      await updateCertificateAction(initial.id, data);
      toast.success("Certificate updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
          <DialogDescription>
            Update the details of your certificate or qualification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
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

              <Input
                label="Date"
                placeholder="e.g. 2024"
                {...register("date")}
              />

              <Input
                label="Credential URL"
                placeholder="https://..."
                hint="Link to verify the credential"
                error={errors.credentialUrl?.message}
                {...register("credentialUrl")}
              />
            </div>

            <Separator.Root className="bg-gray-800 h-px" />

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
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending} disabled={uploading}>
              Update Certificate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
