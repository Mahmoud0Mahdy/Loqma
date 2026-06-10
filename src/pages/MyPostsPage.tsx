import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostCard, Post } from "../components/PostCard";
import { getMyPosts, savePost, votePost } from "../api/communityApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function MyPostsPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const mapApiPostToPostCard = (post: any): Post => {
    const createdAtValue = post.createdAt;

    const timestamp = createdAtValue
      ? formatDistanceToNow(new Date(createdAtValue), {
          addSuffix: true,
        })
      : "Just now";

    return {
      id: String(post.id),

      userId: "",

      author: {
        name: "You",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=my-posts`,
      },

      title: post.title ?? "",

      content: `Status: ${post.status}`,

      imageUrl: post.imageUrl ?? "",

      tags: [post.status ?? "Pending"],

      upvotes: post.votes ?? 0,

      comments: post.commentsCount ?? 0,

      timestamp,

      isSaved: false,

      currentUserVote: 0,
    };
  };

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const data = await getMyPosts();

      const postsData = Array.isArray(data)
        ? data
        : (data?.data ?? []);

      setPosts(postsData.map(mapApiPostToPostCard));
    } catch (error) {
      toast.error("Failed to load your posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (
    postId: string,
    voteType: 1 | -1
  ) => {
    try {
      await votePost(postId, voteType);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          const currentVote =
            post.currentUserVote ?? 0;

          const nextVote =
            currentVote === voteType
              ? 0
              : voteType;

          const votesDelta =
            nextVote - currentVote;

          return {
            ...post,
            currentUserVote: nextVote,
            upvotes: post.upvotes + votesDelta,
          };
        })
      );
    } catch {
      toast.error("Failed to submit vote");
    }
  };

  const handleSavePost = async (
    postId: string
  ) => {
    try {
      await savePost(postId);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isSaved: !post.isSaved,
              }
            : post
        )
      );
    } catch {
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-white mb-2">
            My Posts
          </h1>

          <p className="text-green-50">
            View and track all your community
            posts.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">
              Loading your posts...
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onVote={handleVote}
                onSave={handleSavePost}
                onPostClick={(postId) =>
                  navigate(`/posts/${postId}`)
                }
                onCommentsClick={(postId) =>
                  navigate(`/posts/${postId}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">
              You haven't created any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}