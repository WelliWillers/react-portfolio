"use client";

import {
  createContactAction,
  deleteContactAction,
  updateContactAction,
} from "@/app/admin/settings/contacts/actions";
import { Contact } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const TYPES = [
  "email",
  "github",
  "linkedin",
  "website",
  "phone",
  "twitter",
  "other",
] as const;

const contactSchema = z.object({
  type: z.enum(TYPES),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  url: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("http"), {
      message: "Must be a valid URL",
    }),
  visible: z.boolean(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactsManager({
  contacts: initial,
}: {
  contacts: Contact[];
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "email",
      label: "",
      value: "",
      url: "",
      visible: true,
    },
  });

  function onSubmit(data: ContactFormData) {
    startTransition(async () => {
      await createContactAction(data);
      reset();
      toast.success("Contact added!");
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Add Contact
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <select
            {...register("type")}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary-500 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div>
            <input
              placeholder="Label (e.g. Email)"
              {...register("label")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.label && (
              <p className="text-red-400 text-xs mt-1">
                {errors.label.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Value (e.g. you@email.com)"
              {...register("value")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.value && (
              <p className="text-red-400 text-xs mt-1">
                {errors.value.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="URL (optional)"
              {...register("url")}
              className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            {errors.url && (
              <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {isPending ? "Adding..." : "Add Contact"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">
                Type
              </th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">
                Label
              </th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">
                Value
              </th>
              <th className="text-right px-5 py-3 text-gray-400 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {initial.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-800/50">
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {contact.type}
                  </span>
                </td>

                <td className="px-5 py-3 text-gray-300">{contact.label}</td>

                <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                  {contact.value}
                </td>

                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* TOGGLE VISIBILITY */}
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          await updateContactAction(contact.id, {
                            visible: !contact.visible,
                          });
                          toast.success("Updated!");
                        })
                      }
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors"
                    >
                      {contact.visible ? (
                        <Eye size={14} className="text-green-400" />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        startTransition(async () => {
                          await deleteContactAction(contact.id);
                          toast.success("Removed!");
                        })
                      }
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!initial.length && (
          <div className="text-center py-10 text-gray-600">
            No contacts added yet.
          </div>
        )}
      </div>
    </div>
  );
}
