"use client";

import {
  approveCommentAction,
  deleteCommentAction,
  replyCommentAction,
} from "@/app/admin/blog/actions";
import { PostComment } from "@/domain/entities";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Check,
  CheckCheck,
  ExternalLink,
  MessageSquare,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../../ui/Button";

type Filter = "all" | "pending" | "approved";

function ReplyModal({
  comment,
  onClose,
}: {
  comment: PostComment;
  onClose: () => void;
}) {
  const [reply, setReply] = useState(comment.reply ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!reply.trim()) return;
    startTransition(async () => {
      await replyCommentAction(comment.id, reply.trim());
      toast.success("Reply sent!");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Reply size={16} className="text-primary-400" />
            <h2 className="text-sm font-semibold text-white">
              Reply to {comment.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 border-b border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Original comment</p>
          <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/50 rounded-xl p-3">
            {comment.content}
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">
              Your reply
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write your reply..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isPending}
              disabled={!reply.trim()}
              icon={<Reply size={14} />}
            >
              {comment.reply ? "Update Reply" : "Send Reply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommentsManager({ comments }: { comments: PostComment[] }) {
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [replying, setReplying] = useState<PostComment | null>(null);

  const filtered = comments.filter((c) => {
    const matchesFilter =
      filter === "all" ? true : filter === "pending" ? !c.approved : c.approved;

    const matchesSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.post?.title?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pending = comments.filter((c) => !c.approved).length;

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveCommentAction(id);
      toast.success("Comment approved!");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCommentAction(id);
      toast.success("Comment deleted!");
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: comments.length, color: "text-white" },
            { label: "Pending", value: pending, color: "text-yellow-400" },
            {
              label: "Approved",
              value: comments.length - pending,
              color: "text-green-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comments..."
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
            {(["all", "pending", "approved"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {f}
                {f === "pending" && pending > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                    {pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p>No comments found.</p>
            </div>
          )}

          {filtered.map((comment) => (
            <div
              key={comment.id}
              className="p-5 group hover:bg-gray-800/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-white text-sm font-semibold">
                      {comment.name}
                    </span>
                    {comment.email && (
                      <span className="text-gray-500 text-xs">
                        {comment.email}
                      </span>
                    )}
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {comment.post && (
                      <>
                        <span className="text-gray-700 text-xs">·</span>
                        <a
                          href={`/blog/${comment.post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-400 text-xs hover:underline"
                        >
                          {comment.post.title}
                          <ExternalLink size={10} />
                        </a>
                      </>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${
                        comment.approved
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {comment.content}
                  </p>

                  {comment.reply && (
                    <div className="mt-3 pl-3 border-l-2 border-primary-500/40">
                      <p className="text-xs text-primary-400 font-medium mb-1">
                        Your reply
                      </p>
                      <p className="text-gray-400 text-sm">{comment.reply}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!comment.approved && (
                    <Tooltip.Provider delayDuration={300}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <Check size={15} />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="z-50 px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg shadow-lg"
                            sideOffset={5}
                          >
                            Approve
                            <Tooltip.Arrow className="fill-gray-700" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}

                  <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() => setReplying(comment)}
                          className="p-1.5 rounded-lg hover:bg-primary-500/10 text-gray-400 hover:text-primary-400 transition-colors"
                        >
                          {comment.reply ? (
                            <CheckCheck size={15} />
                          ) : (
                            <Reply size={15} />
                          )}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="z-50 px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg shadow-lg"
                          sideOffset={5}
                        >
                          {comment.reply ? "Edit reply" : "Reply"}
                          <Tooltip.Arrow className="fill-gray-700" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="z-50 px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg shadow-lg"
                          sideOffset={5}
                        >
                          Delete
                          <Tooltip.Arrow className="fill-gray-700" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {replying && (
        <ReplyModal comment={replying} onClose={() => setReplying(null)} />
      )}
    </>
  );
}
