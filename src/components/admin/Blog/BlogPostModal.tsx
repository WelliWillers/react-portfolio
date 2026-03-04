"use client";

import { updatePostAction } from "@/app/admin/blog/actions";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Post, PostCategory } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState, useTransition } from "react";
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
import { PostFormData, postSchema, Textarea } from "./BlogManager";

function CategoryInput({
  value,
  onChange,
  suggestions,
}: {
  value: string;
  onChange: (val: string) => void;
  suggestions: PostCategory[];
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = suggestions.filter((s) =>
    s.name.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-1.5 relative">
      <Label.Root className="text-xs font-medium text-gray-400">
        Category
      </Label.Root>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="e.g. Tutorial, Career..."
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
          {filtered.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onMouseDown={() => {
                onChange(cat.name);
                setShowSuggestions(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-600">
        Type to create new or select existing
      </p>
    </div>
  );
}

export function BlogPostModal({
  post: initial,
  open,
  onClose,
  categories,
}: {
  post: Post;
  open: boolean;
  onClose: () => void;
  categories: PostCategory[];
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverUrl: "",
      published: false,
      featured: false,
      categoryId: "",
    },
  });

  useEffect(() => {
    reset({
      title: initial.title,
      excerpt: initial.excerpt ?? "",
      content: initial.content,
      coverUrl: initial.coverUrl ?? "",
      published: initial.published,
      featured: initial.featured,
      categoryId: initial.category?.name ?? "",
    });
  }, [initial, reset]);

  const published = watch("published");
  const featured = watch("featured");
  const coverUrl = watch("coverUrl");

  function onSubmit(data: PostFormData) {
    startTransition(async () => {
      await updatePostAction(initial.id, data);
      toast.success("Post updated!");
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update your blog post content, tags and visibility.
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
              placeholder="Post title..."
              error={errors.title?.message}
              {...register("title")}
            />

            <Input
              label="Excerpt"
              placeholder="Short description..."
              hint="Max 200 characters"
              error={errors.excerpt?.message}
              {...register("excerpt")}
            />

            <Textarea
              label="Content"
              required
              rows={14}
              placeholder="Write in Markdown..."
              hint="Markdown is supported"
              error={errors.content?.message}
              {...register("content")}
            />

            <ImageUploadField
              label="Post Cover image"
              value={coverUrl}
              onChange={(url) => setValue("coverUrl", url)}
            />

            <Separator.Root className="bg-gray-800 h-px" />

            <div className="grid sm:grid-cols-2 gap-4">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategoryInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    suggestions={categories}
                  />
                )}
              />
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
                    className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-green-600 focus:outline-none cursor-pointer"
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
                    className="w-10 h-6 bg-gray-700 rounded-full relative transition-colors data-[state=checked]:bg-yellow-500 focus:outline-none cursor-pointer"
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
            <Button type="submit" loading={isPending}>
              Update Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
