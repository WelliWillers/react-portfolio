"use client";

import { updateContactAction } from "@/app/admin/settings/contacts/actions";
import { Contact } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
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
  CONTACT_TYPES,
  ContactFormData,
  contactSchema,
} from "./ContactsManager";

export function ContactsManagerModal({
  contact: initial,
  open,
  onClose,
}: {
  contact: Contact;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

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
      await updateContactAction(initial.id, data);
      reset();
      toast.success("Contact updated!");
      onClose();
    });
  }

  useEffect(() => {
    reset({
      type: initial.type as any,
      label: initial.label,
      value: initial.value,
      url: initial.url || "",
      visible: initial.visible,
    });
  }, [initial, reset]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update your contact method details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
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
                                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 rounded-lg cursor-pointer focus:outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-white transition-colors capitalize"
                              >
                                <Select.ItemText>{t}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check
                                    size={14}
                                    className="text-primary-400"
                                  />
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
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Update Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
