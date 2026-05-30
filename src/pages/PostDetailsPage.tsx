import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bookmark,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  createComment,
  deleteComment,
  deletePost,
  getPostById,
  getPostComments,
  savePost,
  votePost,
} from "../api/communityApi";
import { Post } from "../components/PostCard";
import { useApp } from "../contexts/AppContext";

interface CommentItem {
  id: string;
  content: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
  userId?: string;
  isOwnedByCurrentUser?: boolean;
}

export function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const mapApiPostToPostCard = (apiPost: any): Post => {
    const authorName =
      apiPost.userName ??
      apiPost.authorName ??
      apiPost.author?.name ??
      apiPost.user?.name ??
      "Anonymous";

    return {
      id: String(apiPost.id),
      userId: apiPost.userId,
      author: {
        name: authorName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
      },
      title: apiPost.title ?? "",
      content: apiPost.content ?? "",
      imageUrl: apiPost.imageUrl ?? "",
      tags: apiPost.tags?.map((tag: any) => tag.name ?? tag) ?? [],
      upvotes: apiPost.votes ?? apiPost.upvotes ?? apiPost.voteCount ?? 0,
      comments: apiPost.commentsCount ?? apiPost.comments ?? 0,
      timestamp: apiPost.createdAt
        ? formatDistanceToNow(new Date(apiPost.createdAt), { addSuffix: true })
        : "Just now",
      isSaved: apiPost.isSaved ?? false,
      currentUserVote: apiPost.currentUserVote ?? 0,
    };
  };

  const mapApiComment = (comment: any): CommentItem => {
    const userName =
      comment.userName ??
      comment.authorName ??
      comment.author?.name ??
      "Anonymous";
    return {
      id: String(comment.id),
      content: comment.content ?? "",
      userName,
      userAvatar:
        comment.userAvatar ??
        comment.authorAvatar ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
      createdAt: comment.createdAt
        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
        : "Just now",
      userId: comment.userId ? String(comment.userId) : undefined,
      isOwnedByCurrentUser: comment.isOwnedByCurrentUser,
    };
  };

  const fetchPostDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([
        getPostById(id),
        getPostComments(id),
      ]);

      const normalizedPost = postData?.data ?? postData;
      const normalizedComments = Array.isArray(commentsData)
        ? commentsData
        : (commentsData?.data ?? []);

      setPost(mapApiPostToPostCard(normalizedPost));
      setComments(normalizedComments.map(mapApiComment));
    } catch (error) {
      toast.error("Failed to load post details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleVote = async (voteType: 1 | -1) => {
    if (!post) return;
    try {
      await votePost(post.id, voteType);
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        const currentVote = prevPost.currentUserVote ?? 0;
        const nextVote = currentVote === voteType ? 0 : voteType;
        const votesDelta = nextVote - currentVote;
        return {
          ...prevPost,
          currentUserVote: nextVote,
          upvotes: prevPost.upvotes + votesDelta,
        };
      });
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const handleSave = async () => {
    if (!post) return;
    try {
      await savePost(post.id);
      setPost((prevPost) =>
        prevPost ? { ...prevPost, isSaved: !prevPost.isSaved } : prevPost,
      );
    } catch (error) {
      toast.error("Failed to update saved post");
    }
  };

  const handleCreateComment = async () => {
    if (!id) return;
    if (!commentInput.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      await createComment(id, commentInput.trim());
      setCommentInput("");
      const commentsData = await getPostComments(id);
      const normalizedComments = Array.isArray(commentsData)
        ? commentsData
        : (commentsData?.data ?? []);
      setComments(normalizedComments.map(mapApiComment));
      setPost((prevPost) =>
        prevPost ? { ...prevPost, comments: prevPost.comments + 1 } : prevPost,
      );
      toast.success("Comment posted");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const canDeletePost = () => {
    if (!post) return false;
    if (!state.user) return false;
    return Number(post.userId) === Number(state.user.id);
  };

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      navigate("/community");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const canDeleteComment = (comment: CommentItem) => {
    if (comment.isOwnedByCurrentUser) return true;
    if (!state.user) return false;
    if (comment.userId && String(state.user.id) === comment.userId) return true;
    return comment.userName === state.user.email;
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setPost((prevPost) =>
        prevPost
          ? { ...prevPost, comments: Math.max(prevPost.comments - 1, 0) }
          : prevPost,
      );
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <p className="text-gray-500">Loading post...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <p className="text-gray-500">Post not found.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 font-medium text-sm py-2 px-2 rounded-lg transition-colors -ml-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
            </div>

            {canDeletePost() && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <h1 className="text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(1)}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  post.currentUserVote === 1
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                <ArrowUp size={18} />
              </button>
              <span
                className={`text-sm ${post.upvotes > 0 ? "text-orange-600" : "text-gray-600"}`}
              >
                {post.upvotes}
              </span>
              <button
                onClick={() => handleVote(-1)}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  post.currentUserVote === -1
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                <ArrowDown size={18} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle size={16} />
              <span className="text-sm">{post.comments} comments</span>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1 transition-colors ${
                post.isSaved
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <Bookmark
                size={16}
                fill={post.isSaved ? "currentColor" : "none"}
              />
              <span className="text-sm">{post.isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Comments</h2>

          <div className="flex gap-3 mb-6">
            <Input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button onClick={handleCreateComment} disabled={submittingComment}>
              {submittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </div>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-100 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.userAvatar}
                          alt={comment.userName}
                        />
                        <AvatarFallback>
                          {comment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-900">
                          {comment.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment.createdAt}
                        </p>
                      </div>
                    </div>

                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 mt-3">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No comments yet. Be the first to comment.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
