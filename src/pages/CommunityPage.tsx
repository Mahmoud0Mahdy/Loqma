import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostCard, Post } from "../components/PostCard";
import { CommunitySidebar } from "../components/CommunitySidebar";
import { CreatePostModal } from "../components/CreatePostModal";
import { getAllPosts, savePost, votePost } from "../api/communityApi";
import { toast } from "sonner@2.0.3";
import { formatDistanceToNow } from "date-fns";

export function CommunityPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const mapApiPostToPostCard = (post: any): Post => {
    const authorName =
      post.userName ??
      post.authorName ??
      post.author?.name ??
      post.user?.name ??
      "Anonymous";

    const authorAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;

    const tags =
      post.tags?.map((tag: any) => tag.name ?? tag) ??
      post.tagNames?.map((tag: string) => tag) ??
      [];

    const createdAtValue = post.createdAt ?? post.timestamp;
    const timestamp = createdAtValue
      ? formatDistanceToNow(new Date(createdAtValue), { addSuffix: true })
      : "Just now";

    return {
      id: String(post.id),
      author: {
        name: authorName,
        avatar: authorAvatar,
      },
      title: post.title ?? "",
      content: post.content ?? "",
      imageUrl: post.imageUrl ?? "",
      tags,
      upvotes: post.votes ?? post.upvotes ?? post.voteCount ?? 0,
      comments: post.commentsCount ?? post.comments ?? 0,
      timestamp,
      isSaved: post.isSaved ?? false,
      currentUserVote: post.currentUserVote ?? 0,
    };
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      const postsData = Array.isArray(data) ? data : (data?.data ?? []);
      setPosts(postsData.map(mapApiPostToPostCard));
    } catch (error) {
      toast.error("Failed to load community posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (postId: string, voteType: 1 | -1) => {
    try {
      await votePost(postId, voteType);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          const currentVote = post.currentUserVote ?? 0;
          const nextVote = currentVote === voteType ? 0 : voteType;
          const votesDelta = nextVote - currentVote;

          return {
            ...post,
            currentUserVote: nextVote,
            upvotes: post.upvotes + votesDelta,
          };
        }),
      );
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      await savePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isSaved: !post.isSaved } : post,
        ),
      );
    } catch (error) {
      toast.error("Failed to update saved post");
    }
  };

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => {
          const categoryMap: { [key: string]: string[] } = {
            recipes: ["Recipes"],
            tips: ["Tips", "Kitchen Tips"],
            reviews: ["Products", "Product Reviews"],
            questions: ["Questions"],
            budget: ["Budget Meals"],
          };
          return post.tags.some((tag) =>
            categoryMap[selectedCategory]?.includes(tag),
          );
        });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-white mb-2">Community</h1>
          <p className="text-green-50 max-w-2xl">
            Connect with fellow food lovers, share recipes, get cooking tips,
            and discover new products. Join the conversation!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onSave={handleSavePost}
                  onPostClick={(postId) => navigate(`/posts/${postId}`)}
                  onCommentsClick={(postId) => navigate(`/posts/${postId}`)}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500">
                  No posts found in this category.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <CommunitySidebar
                onCreatePost={() => setIsCreateModalOpen(true)}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}
