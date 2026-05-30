import { ArrowUp, ArrowDown, MessageCircle, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export interface Post {
  id: string;

  userId: number;

  author: {
    name: string;
    avatar: string;
  };

  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  upvotes: number;
  comments: number;
  timestamp: string;
  isSaved: boolean;
  currentUserVote?: number;
}

interface PostCardProps {
  post: Post;
  onPostClick?: (postId: string) => void;
  onVote?: (postId: string, voteType: 1 | -1) => void | Promise<void>;
  onSave?: (postId: string) => void | Promise<void>;
  onCommentsClick?: (postId: string) => void;
}

export function PostCard({
  post,
  onPostClick,
  onVote,
  onSave,
  onCommentsClick,
}: PostCardProps) {
  const tagColors: { [key: string]: string } = {
    Recipes: "bg-green-100 text-green-700 hover:bg-green-200",
    Tips: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    Questions: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    Products: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    "Budget Meals": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Vote section */}
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-50">
          <button
            onClick={() => onVote?.(post.id, 1)}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
              post.currentUserVote === 1 ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <ArrowUp size={20} />
          </button>
          <span
            className={`text-sm ${
              post.upvotes > 0
                ? "text-orange-600"
                : post.upvotes < 0
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            {post.upvotes}
          </span>
          <button
            onClick={() => onVote?.(post.id, -1)}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
              post.currentUserVote === -1 ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Content section */}
        <div className="flex-1 p-4">
          {/* Author info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>

          {/* Post title */}
          <h3
            className="mb-2 text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
            onClick={() => onPostClick?.(post.id)}
          >
            {post.title}
          </h3>

          {/* Post content */}
          <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>

          {/* Post image */}
          {post.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onPostClick?.(post.id)}
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`${tagColors[tag] || "bg-gray-100 text-gray-700"} rounded-full`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              onClick={() => onCommentsClick?.(post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments} comments</span>
            </button>
            <button
              onClick={() => onSave?.(post.id)}
              className={`flex items-center gap-1 transition-colors ${
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
      </div>
    </div>
  );
}
