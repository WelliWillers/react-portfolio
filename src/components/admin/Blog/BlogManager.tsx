"use client";

import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/app/admin/blog/actions";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Post, PostCategory } from "@/domain/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import * as Switch from "@radix-ui/react-switch";
import { Clock, Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { BlogPostModal } from "./BlogPostModal";

export const postSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  excerpt: z.string().max(200, "Excerpt too long").optional(),
  content: z.string().min(10, "Content is required"),
  coverUrl: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  categoryId: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Textarea({
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
        className={`w-full px-4 py-2 bg-gray-800 border rounded-xl text-white text-sm
          placeholder-gray-500 focus:outline-none transition-colors resize-none
          ${error ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-primary-500"}
          ${className ?? ""}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

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
        placeholder="e.g. Tutorial, Career, DevOps..."
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

export function BlogManager({
  posts: initial,
  categories,
}: {
  posts: Post[];
  categories: PostCategory[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Post | null>(null);

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

  const published = watch("published");
  const featured = watch("featured");
  const coverUrl = watch("coverUrl");

  function onSubmit(data: PostFormData) {
    startTransition(async () => {
      await createPostAction(data);
      toast.success("Post created!");
      reset();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePostAction(id);
      toast.success("Post deleted!");
    });
  }

  function handleTogglePublished(post: Post) {
    startTransition(async () => {
      await updatePostAction(post.id, { published: !post.published });
      toast.success(post.published ? "Post unpublished" : "Post published!");
    });
  }

  function handleToggleFeatured(post: Post) {
    startTransition(async () => {
      await updatePostAction(post.id, { featured: !post.featured });
      toast.success(
        post.featured ? "Removed from featured" : "Added to featured!",
      );
    });
  }

  return (
    <>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-1">New Post</h3>
          <p className="text-xs text-gray-500 mb-4">
            Write and publish a new blog post.
          </p>

          <Separator.Root className="bg-gray-800 h-px mb-5" />

          <div className="space-y-4">
            <Input
              label="Title"
              required
              placeholder="e.g. How I built my portfolio with Next.js 15"
              error={errors.title?.message}
              {...register("title")}
            />

            <Input
              label="Excerpt"
              placeholder="Short description shown in the post list..."
              hint="Max 200 characters"
              error={errors.excerpt?.message}
              {...register("excerpt")}
            />

            <Textarea
              label="Content"
              required
              rows={12}
              placeholder="Write your post in Markdown..."
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

          <Separator.Root className="bg-gray-800 h-px my-5" />

          <div className="flex justify-end">
            <Button type="submit" loading={isPending} icon={<Plus size={16} />}>
              Create Post
            </Button>
          </div>
        </form>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Post
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {initial.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-600">
                    No posts yet.
                  </td>
                </tr>
              )}
              {initial.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {post.featured && (
                        <Star size={13} className="text-yellow-400 shrink-0" />
                      )}
                      <div>
                        <p className="text-gray-200 font-medium truncate max-w-[240px]">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Eye size={11} /> {post.views}
                          </span>
                          {post.readTime && (
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                              <Clock size={11} /> {post.readTime}min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {post.category ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        post.published
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-gray-700/50 text-gray-500 border border-gray-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          post.published ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )
                        }
                        onClick={() => handleTogglePublished(post)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          <Star
                            size={14}
                            className={post.featured ? "text-yellow-400" : ""}
                          />
                        }
                        onClick={() => handleToggleFeatured(post)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={14} />}
                        onClick={() => setEditing(post)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDelete(post.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <BlogPostModal
          post={editing}
          open={!!editing}
          categories={categories}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
