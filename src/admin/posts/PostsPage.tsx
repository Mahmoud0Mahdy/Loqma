import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { deletePost, getAllPosts } from "../../api/communityApi";

// استيراد المكونات
import { PostStats } from "./components/PostStats";
import { PostCard } from "./components/PostCard";

const POSTS_PER_PAGE = 3;
const TAG_FILTERS = [
  "All",
  "Recipes",
  "Kitchen Tips",
  "Product Reviews",
  "Questions",
  "Budget Meals",
];

export function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      const normalizedPosts = Array.isArray(data) ? data : (data?.data ?? []);
      setPosts(normalizedPosts);
    } catch (error) {
      toast.error("Failed to load community posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number | string) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  const filteredPosts = posts.filter((post) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch =
      (post.title || "").toLowerCase().includes(normalizedQuery) ||
      (post.content || "").toLowerCase().includes(normalizedQuery) ||
      (post.userName || post.username || "")
        .toLowerCase()
        .includes(normalizedQuery);

    const postTags = Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === "string"
        ? post.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : [];
    const matchesTag = selectedTag === "All" || postTags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Community Moderation
        </h1>
        <p className="text-gray-600">Manage and moderate community posts</p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="h-10 px-3 border border-gray-200 rounded-md bg-white text-sm text-gray-700 md:min-w-[220px]"
          >
            {TAG_FILTERS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Stats Section */}
      <PostStats posts={posts} />

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center text-gray-500">
            <p>Loading posts...</p>
          </Card>
        ) : paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))
        ) : (
          <Card className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No posts found matching your search.</p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className={
                currentPage === i + 1
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
