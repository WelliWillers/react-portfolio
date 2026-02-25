"use client";

import {
  createContactAction,
  deleteContactAction,
  updateContactAction,
} from "@/app/admin/settings/contacts/actions";
import { Contact } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ContactsManagerModal } from "./ContactsManagerModal";

export const CONTACT_TYPES = [
  "email",
  "github",
  "linkedin",
  "website",
  "phone",
  "twitter",
  "other",
] as const;

export const contactSchema = z.object({
  type: z.enum(CONTACT_TYPES),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  url: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http") ||
        val.startsWith("mailto:") ||
        val.startsWith("tel:"),
      { message: "Must be a valid URL" },
    ),
  visible: z.boolean(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function ContactsManager({
  contacts: initial,
}: {
  contacts: Contact[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Contact | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
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
    <>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Add Contact
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Add your social links and contact methods.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Type <span className="text-red-400">*</span>
              </Label.Root>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 hover:border-gray-600 transition-colors data-[placeholder]:text-gray-500">
                      <Select.Value placeholder="Select type" />
                      <Select.Icon>
                        <ChevronDown size={14} className="text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                        <Select.Viewport className="p-1">
                          {CONTACT_TYPES.map((t) => (
                            <Select.Item
                              key={t}
                              value={t}
                              className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white focus:outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-white transition-colors"
                            >
                              <Select.ItemText className="capitalize">
                                {t}
                              </Select.ItemText>
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

            <Input
              label="Label"
              required
              placeholder="e.g. Email"
              error={errors.label?.message}
              {...register("label")}
            />

            <Input
              label="Value"
              required
              placeholder="e.g. you@email.com"
              error={errors.value?.message}
              {...register("value")}
            />

            <Input
              label="URL"
              placeholder="https://..."
              hint="Optional direct link"
              error={errors.url?.message}
              {...register("url")}
            />

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-xs font-medium text-gray-400">
                Visible on portfolio
              </Label.Root>
              <Controller
                name="visible"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch.Root
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
                    >
                      <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
                    </Switch.Root>
                    <span className="text-sm text-gray-400">
                      {field.value ? "Visible" : "Hidden"}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex justify-end">
            <Button type="submit" loading={isPending} icon={<Plus size={16} />}>
              Add Contact
            </Button>
          </div>
        </form>

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
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Visible
                </th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {initial.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 capitalize">
                      {contact.type}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-gray-300">{contact.label}</td>

                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                    {contact.value}
                  </td>

                  <td className="px-5 py-3">
                    <Switch.Root
                      checked={contact.visible}
                      onCheckedChange={() =>
                        startTransition(async () => {
                          await updateContactAction(contact.id, {
                            visible: !contact.visible,
                          });
                          toast.success("Updated!");
                        })
                      }
                      className="w-9 h-5 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-primary-600 focus:outline-none cursor-pointer"
                    >
                      <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={14} />}
                        onClick={() => setEditing(contact)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() =>
                          startTransition(async () => {
                            await deleteContactAction(contact.id);
                            toast.success("Removed!");
                          })
                        }
                      />
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

      {editing && (
        <ContactsManagerModal
          contact={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
