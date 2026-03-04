"use client";

import {
  submitCommentAction,
  trackPostViewAction,
} from "@/app/(public)/blog/[slug]/actions";
import { Post } from "@/domain/entities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function CommentForm({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await submitCommentAction({ postId, ...form });
      setSubmitted(true);
      setForm({ name: "", email: "", content: "" });
    });
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
      >
        <p className="text-green-400 font-medium">Comment submitted!</p>
        <p className="text-gray-400 text-sm mt-1">
          It will appear after approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="your@email.com (optional)"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Comment *</label>
        <textarea
          required
          rows={4}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Share your thoughts..."
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Send size={14} />
        {isPending ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
}

export function PostPage({ post }: { post: Post }) {
  const { data: session, status } = useSession();
  const approvedComments = (post.comments ?? []).filter((c) => c.approved);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) return;
    trackPostViewAction(post.id);
  }, [post.id, status]);

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {post.coverUrl && (
        <div className="relative h-64 md:h-96 mb-12">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {post.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                {post.category.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex justify-between md:justify-start items-center gap-4 text-gray-500 text-sm mb-10 pb-10 border-b border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.createdAt)}
            </div>
            {post.readTime && (
              <div className="flex flex-col md:flex-row items-center gap-1.5">
                <Clock size={14} />
                {post.readTime} min read
              </div>
            )}
            <div className="flex flex-col md:flex-row items-center gap-1.5">
              <Eye size={14} />
              {post.views.toLocaleString()} views
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1.5">
              <MessageSquare size={13} />
              {approvedComments.length} comments
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-a:text-primary-400 prose-headings:text-white max-w-none mb-16"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle size={20} className="text-primary-400" />
            <h2 className="text-xl font-bold text-white">
              Comments ({post.comments?.length})
            </h2>
          </div>

          {post.comments!.length > 0 && (
            <div className="space-y-2 mb-10">
              {(post.comments || []).map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 rounded-2xl p-3 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {comment.name[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white text-sm font-medium">
                          {comment.name}
                        </span>
                        <p className="text-gray-500 text-xs">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {comment.content}
                  </p>

                  {comment.reply && (
                    <div className="mt-4 pl-4 border-l-2 border-primary-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            A
                          </span>
                        </div>
                        <span className="text-primary-400 text-xs font-semibold">
                          Author reply
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {comment.reply}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-white font-semibold mb-5">Leave a Comment</h3>
            <CommentForm postId={post.id} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
