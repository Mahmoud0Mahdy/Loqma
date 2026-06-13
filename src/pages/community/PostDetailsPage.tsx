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
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

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
} from "../../components/ui/alert-dialog";

import {
  createComment,
  deleteComment,
  deletePost,
  getPostById,
  getPostComments,
  savePost,
  votePost,
} from "../../api/communityApi";
import { Post } from "./PostCard";
import { useApp } from "../../contexts/AppContext";

import "./post-details.css";

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
      <div className="pd-wrapper">
        <div
          className="pd-container"
          style={{ textAlign: "center", paddingTop: "100px" }}
        >
          <p style={{ color: "#6b7280" }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pd-wrapper">
        <div
          className="pd-container"
          style={{ textAlign: "center", paddingTop: "100px" }}
        >
          <p style={{ color: "#6b7280" }}>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-wrapper">
      <div className="pd-container">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pd-back-btn"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Post Card */}
        <div className="pd-card">
          <div className="pd-header">
            <div className="pd-author">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="pd-author-info">
                <h3>{post.author.name}</h3>
                <p>{post.timestamp}</p>
              </div>
            </div>

            {canDeletePost() && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    style={{
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Delete this post permanently? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletePost}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <h1 className="pd-title">{post.title}</h1>
          <p className="pd-content">{post.content}</p>

          {post.imageUrl && (
            <div className="pd-image-wrapper">
              <img src={post.imageUrl} alt={post.title} className="pd-image" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pd-actions">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(1)}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  post.currentUserVote === 1
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                <ArrowUp size={20} />
              </button>
              <span
                className={`text-sm font-bold ${post.upvotes > 0 ? "text-orange-600" : "text-gray-600"}`}
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
                <ArrowDown size={20} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">
                {post.comments} comments
              </span>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1 font-medium transition-colors ${
                post.isSaved
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <Bookmark
                size={18}
                fill={post.isSaved ? "currentColor" : "none"}
              />
              <span className="text-sm">{post.isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Comments Card */}
        <div className="pd-card">
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Comments
          </h2>

          <div className="flex gap-3 mb-8">
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
                  className="border border-gray-100 rounded-lg p-5 bg-gray-50/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
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
                        <p className="text-sm font-bold text-gray-900">
                          {comment.userName}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          {comment.createdAt}
                        </p>
                      </div>
                    </div>

                    {canDeleteComment(comment) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteComment(comment.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
