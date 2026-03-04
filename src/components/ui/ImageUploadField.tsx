import React, { useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { toast } from "react-hot-toast";

interface ImageUploadFieldProps {
  label: string;
  value: string | undefined;
  onChange: (url: string) => void;
  endpoint?: string; // Caso queira mudar a rota da API depois
}

export function ImageUploadField({
  label,
  value,
  onChange,
  endpoint = "/api/upload",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      onChange(data.url);
      toast.success("Imagem carregada!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label.Root className="text-xs font-medium text-gray-400">
        {label}
      </Label.Root>

      {value && (
        <div className="relative h-36 rounded-xl overflow-hidden border border-gray-700">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <label
        className={`flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-dashed rounded-xl cursor-pointer transition-colors text-sm w-fit
        ${
          value
            ? "border-green-500/50 text-green-400"
            : "border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-400"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}

        {uploading ? "Enviando..." : value ? "Alterar imagem" : "Upload imagem"}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
