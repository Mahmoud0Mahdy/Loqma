import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  deletePost,
  getAdminPosts,
  updatePostStatus,
  deleteComment,
} from "../../api/communityApi";

import { PostStats } from "./components/PostStats";
import { PostsTable, PostStatus } from "./components/PostsTable";
import { PostDetailsDialog } from "./components/PostDetailsDialog";

const ITEMS_PER_PAGE = 7;

export function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts();

      const raw = Array.isArray(data) ? data : (data?.data ?? []);

      setPosts(raw);
    } catch {
      toast.error("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleDelete = async (postId: number | string) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

const handleStatusChange = async (
  postId: number | string,
  newStatus: PostStatus
) => {
  try {
    await updatePostStatus(postId, newStatus);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: newStatus,
            }
          : p
      )
    );

    toast.success("Post status updated");
  } catch {
    toast.error("Failed to update status");
  }
};

  const handleDeleteComment = async (
    postId: number | string,
    commentId: number | string,
  ) => {
    await deleteComment(postId, commentId);
  };

  const handleViewDetails = (post: any) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  // ─── Processing ───────────────────────────────────────────────────────────

  let processed = [...posts];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    processed = processed.filter(
      (p) =>
        p.id?.toString().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.userName || p.username || "").toLowerCase().includes(q),
    );
  }

  // 🔥 التعديل هنا: ظبطنا الـ map عشان يقرا كلمة Approved صح
  if (statusFilter !== "All") {
    const statusMap: Record<string, PostStatus> = {
      Pending: PostStatus.Pending,
      Approved: PostStatus.Approved,
      Rejected: PostStatus.Rejected,
    };
processed = processed.filter(
  (p) => p.status === statusMap[statusFilter]
);
  }

  processed.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "votes_high":
        return (b.votes ?? b.upvotes ?? 0) - (a.votes ?? a.upvotes ?? 0);
      case "votes_low":
        return (a.votes ?? a.upvotes ?? 0) - (b.votes ?? b.upvotes ?? 0);
      case "comments_high":
        return (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
      case "id_desc":
        return b.id - a.id;
      case "id_asc":
        return a.id - b.id;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = processed.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Community Moderation
        </h1>
        <p className="text-gray-600">Manage and moderate community posts</p>
      </div>

      {/* Filter & Sort Bar */}
      <Card className="p-4 border-gray-100 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by ID, title, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[155px] bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                {/* 🔥 التعديل هنا: غيرنا الـ value لـ Approved */}
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[185px] bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="votes_high">Votes: High to Low</SelectItem>
                <SelectItem value="votes_low">Votes: Low to High</SelectItem>
                <SelectItem value="comments_high">Most Comments</SelectItem>
                <SelectItem value="id_desc">Post ID: Descending</SelectItem>
                <SelectItem value="id_asc">Post ID: Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <PostStats posts={posts} />

      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center text-gray-500 border-gray-100">
            <p>Loading posts...</p>
          </Card>
        ) : currentPosts.length > 0 ? (
          <PostsTable
            posts={currentPosts}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <Card className="p-12 text-center text-gray-500 border-gray-100">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No posts found matching your criteria.</p>
          </Card>
        )}
      </div>

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

      <PostDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        post={selectedPost}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
