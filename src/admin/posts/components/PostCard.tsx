import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Heart, MessageCircle, Calendar, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getPostComments } from "../../../api/communityApi";
import { toast } from "sonner";
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

interface PostCardProps {
  post: any;
  onDelete: (postId: number | string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const avatarSrc = useMemo(() => {
    if (avatarFailed || !post.userAvatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName || post.username || "User")}&background=e5e7eb&color=374151`;
    }
    return post.userAvatar;
  }, [avatarFailed, post.userAvatar, post.userName, post.username]);

  const postImage = post.image || post.imageUrl;
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];

  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (comments.length > 0) {
      return;
    }

    setCommentsLoading(true);
    try {
      const data = await getPostComments(post.id);
      const normalizedComments = Array.isArray(data)
        ? data
        : (data?.data ?? []);
      setComments(normalizedComments);
    } catch (error) {
      toast.error("Failed to load comments");
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <img
          src={avatarSrc}
          alt={post.userName || post.username || "User"}
          className="w-10 h-10 rounded-full object-cover border"
          onError={() => setAvatarFailed(true)}
        />

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-semibold leading-5">{post.title}</h3>
              <p className="text-sm text-gray-600">
                by {post.userName || post.username}
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(post.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Post
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <p
            className="text-gray-700 text-sm mb-2 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.content}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {postImage && (
            <img
              src={postImage}
              alt={post.title}
              className="w-full max-w-sm h-32 object-cover rounded-lg mb-2 border"
            />
          )}

          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.votes}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.commentsCount}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={handleToggleComments}>
              {showComments ? "Hide Comments" : "View Comments"}
            </Button>

            {showComments && (
              <div className="mt-3 space-y-2">
                {commentsLoading ? (
                  <p className="text-sm text-gray-500">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-md border border-gray-100 p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800">
                          {comment.userName || comment.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
