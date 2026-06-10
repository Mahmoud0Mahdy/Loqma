import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  MessageCircle,
  Calendar,
  Trash2,
  User,
  ArrowUp,
  ArrowDown,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { getPostComments } from "../../../api/communityApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

export enum PostStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface PostDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: any | null;
  onDeleteComment: (
    postId: number | string,
    commentId: number | string,
  ) => Promise<void>;
}

export function PostDetailsDialog({
  isOpen,
  onClose,
  post,
  onDeleteComment,
}: PostDetailsDialogProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<
    number | string | null
  >(null);

  useEffect(() => {
    if (isOpen && post) {
      setAvatarFailed(false);
      fetchComments();
    }
  }, [isOpen, post?.id]);

  const fetchComments = async () => {
    if (!post) return;
    setCommentsLoading(true);
    try {
      const data = await getPostComments(post.id);
      const normalized = Array.isArray(data) ? data : (data?.data ?? []);
      setComments(normalized);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number | string) => {
    setDeletingCommentId(commentId);
    try {
      await onDeleteComment(post.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (!post) return null;

  const safeStatus = [
    PostStatus.Pending,
    PostStatus.Approved,
    PostStatus.Rejected,
  ].includes(post.status)
    ? post.status
    : PostStatus.Pending;

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.Pending:
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 border-orange-200"
          >
            Pending
          </Badge>
        );
      case PostStatus.Approved:
        return <Badge className="bg-green-500">Approved</Badge>;
      case PostStatus.Rejected:
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const postImage = post.image || post.imageUrl;

  const voteScore = post.votes ?? post.upvotes ?? post.voteCount ?? 0;
  const savesCount = Array.isArray(post.saves)
    ? post.saves.length
    : typeof post.saves === "number"
      ? post.saves
      : (post.savesCount ?? post.savedCount ?? (post.isSaved ? 1 : 0));

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

  const avatarSrc =
    avatarFailed || !post.userAvatar
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName || post.username || "User")}&background=d1fae5&color=065f46`
      : post.userAvatar;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3 flex-wrap">
            Post #{String(post.id).padStart(5, "0")}
            {getStatusBadge(safeStatus)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full post details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Author Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <img
              src={avatarSrc}
              alt={post.userName || "User"}
              onError={() => setAvatarFailed(true)}
              className="w-11 h-11 rounded-full object-cover border-2 border-green-100"
            />
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {post.userName || post.username || "Unknown User"}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-black text-gray-900 leading-snug">
            {post.title || "Untitled"}
          </h2>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-100 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white border border-gray-100 rounded-xl p-4">
            {post.content || "No content."}
          </div>

          {/* Post Image */}
          {postImage && (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <img
                src={postImage}
                alt={post.title}
                className="w-full max-h-72 object-cover"
              />
            </div>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 text-sm border-t border-gray-100 pt-4 mb-2">
            <div className="flex items-center gap-1.5 font-bold">
              {voteScore > 0 ? (
                <ArrowUp className="w-4 h-4 text-orange-500" />
              ) : voteScore < 0 ? (
                <ArrowDown className="w-4 h-4 text-blue-500" />
              ) : (
                <ArrowUp className="w-4 h-4 text-gray-400" />
              )}
              <span
                className={
                  voteScore > 0
                    ? "text-orange-500"
                    : voteScore < 0
                      ? "text-blue-500"
                      : "text-gray-500"
                }
              >
                {voteScore} votes
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-rose-500">
              <Bookmark className="w-4 h-4" />
              <span>{savesCount} saves</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-blue-500">
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 mt-4">
              Comments
            </h3>
            {commentsLoading ? (
              <p className="text-sm text-gray-400">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No comments yet.</p>
            ) : (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-green-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-bold text-gray-800">
                            {comment.userName || comment.username || "User"}
                          </p>
                          {comment.createdAt && (
                            <p className="text-[10px] text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingCommentId === comment.id}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 px-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
