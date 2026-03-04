import { getAllComments } from "@/application/use-cases";
import { CommentsManager } from "@/components/admin/Comments/CommentsManager";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const comments = await getAllComments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Comments</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage and reply to reader comments.
        </p>
      </div>
      <CommentsManager comments={comments} />
    </div>
  );
}
