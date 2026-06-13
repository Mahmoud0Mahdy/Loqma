import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostCard, Post } from "./PostCard";
import { Button } from "../../components/ui/button";
import { getMyPosts, savePost } from "../../api/communityApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import "./my-posts.css";

export function MyPostsPage() {
  const navigate = useNavigate();

  const { state } = useApp();

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  type FilterType = "All" | "Approved" | "Pending" | "Rejected";

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 5;

  // Check whether the current user is an admin
  const isAdmin = state.user?.role === "Admin" || state.user?.role === "admin";

  // Convert API response into PostCard format
  const mapApiPostToPostCard = (post: any): Post => {
    const createdAtValue = post.createdAt;

    const timestamp = createdAtValue
      ? formatDistanceToNow(new Date(createdAtValue), {
          addSuffix: true,
        })
      : "Just now";

    const rawStatus = post.status ? String(post.status) : "Pending";

    const formattedStatus =
      rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase();

    return {
      id: String(post.id),
      userId: post.userId || "",
      author: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=my-posts",
      },
      title: post.title ?? "Untitled Post",
      content: post.content ?? "",
      imageUrl: post.imageUrl ?? "",
      tags: [formattedStatus],
      upvotes: post.votes ?? 0,
      comments: post.commentsCount ?? 0,
      timestamp,
      isSaved: false,
      currentUserVote: 0,
    };
  };

  // Load user posts
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const data = await getMyPosts();

      const postsData = Array.isArray(data) ? data : (data?.data ?? []);

      const sortedPosts = postsData
        .map(mapApiPostToPostCard)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      setPosts(sortedPosts);
    } catch (error) {
      toast.error("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Save or unsave a post
  const handleSavePost = async (postId: string) => {
    try {
      await savePost(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isSaved: !post.isSaved,
              }
            : post,
        ),
      );
    } catch {
      toast.error("Failed to save post");
    }
  };

  // Apply selected filter
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "All") {
      return true;
    }

    return post.tags.includes(activeFilter);
  });

  const indexOfLastPost = currentPage * postsPerPage;

  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Available filters
  const filters = isAdmin
    ? ([
        {
          id: "All",
          label: "Total Posts",
          icon: Layers,
        },
      ] as const)
    : ([
        {
          id: "All",
          label: "All Posts",
          icon: Layers,
        },
        {
          id: "Approved",
          label: "Approved",
          icon: CheckCircle2,
        },
        {
          id: "Pending",
          label: "Pending",
          icon: Clock,
        },
        {
          id: "Rejected",
          label: "Rejected",
          icon: XCircle,
        },
      ] as const);

  return (
    <div className="mp-wrapper">
      {/* Page hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-white mb-2 text-3xl font-bold">My Posts</h1>

          <p className="text-green-50">
            View and track all your community posts.
          </p>
        </div>
      </div>

      <div className="mp-layout">
        {/* Sidebar filters */}
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">
            {isAdmin ? "Overview" : "Filter by Status"}
          </h3>

          <div>
            {filters.map((filter) => {
              const Icon = filter.icon;

              const isActive = activeFilter === filter.id;

              const count =
                filter.id === "All"
                  ? posts.length
                  : posts.filter((p) => p.tags.includes(filter.id)).length;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterType)}
                  className={`mp-filter-btn ${isActive ? "active" : ""}`}
                  style={
                    isAdmin
                      ? {
                          cursor: "default",
                        }
                      : {}
                  }
                >
                  <Icon size={18} className="mp-filter-icon" />

                  {filter.label}

                  <span className="mp-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Posts feed */}
        <main className="mp-feed">
          {/* Back button */}
          <div>
            <button
              onClick={() => navigate("/community")}
              className="mp-back-btn"
            >
              <ArrowLeft size={16} />
              Back to Community
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-gray-500 font-medium">Loading your posts...</p>
            </div>
          ) : currentPosts.length > 0 ? (
            <>
              {currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  disableVotes={true}
                  onSave={handleSavePost}
                  onPostClick={(postId) => navigate(`/posts/${postId}`)}
                  onCommentsClick={(postId) => navigate(`/posts/${postId}`)}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    disabled={currentPage === 1}
                    className="gap-2 text-gray-600 h-9"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  <span className="text-sm font-medium text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    disabled={currentPage === totalPages}
                    className="gap-2 text-gray-600 h-9"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="text-4xl mb-4">📭</div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Posts Found
              </h3>

              <p className="text-gray-500">
                {activeFilter === "All"
                  ? "You haven't created any posts yet."
                  : `No posts found with status "${activeFilter}".`}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
