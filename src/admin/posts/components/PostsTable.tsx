import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye, Trash2, ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import "../components/posts-admin.css";

export enum PostStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface PostsTableProps {
  posts: any[];
  onDelete: (postId: number | string) => void;
  onViewDetails: (post: any) => void;
  onStatusChange: (postId: number | string, newStatus: PostStatus) => void;
}

export function PostsTable({
  posts,
  onDelete,
  onViewDetails,
  onStatusChange,
}: PostsTableProps) {
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
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Approved
          </Badge>
        );
      case PostStatus.Rejected:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="pa-table-wrap">
      <div className="pa-table-container">
        <table className="pa-table">
          <thead>
            <tr>
              <th style={{ width: "90px" }}>ID</th>
              <th>Author</th>
              <th>Title</th>
              <th style={{ textAlign: "center" }}>Votes</th>
              <th style={{ textAlign: "center" }}>Comments</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th>Update Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const safeStatus =
                (post.status as PostStatus) ||
                (post.postStatus as PostStatus) ||
                PostStatus.Pending;
              const voteScore =
                post.votes ?? post.upvotes ?? post.voteCount ?? 0;

              return (
                <tr key={post.id}>
                  {/* ID */}
                  <td className="pa-post-id">
                    #{String(post.id).padStart(4, "0")}
                  </td>

                  {/* Author & Date */}
                  <td>
                    <div className="pa-author-cell">
                      <div className="pa-avatar">
                        {(post.userName || post.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="pa-author-info">
                        <p className="pa-author-name">
                          {post.userName || post.username || "Unknown"}
                        </p>
                        <p className="pa-post-date">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Title */}
                  <td>
                    <span className="pa-title" title={post.title}>
                      {post.title || "Untitled"}
                    </span>
                  </td>

                  {/* Votes */}
                  <td>
                    <div className="pa-stat-cell">
                      {voteScore > 0 ? (
                        <ArrowUp className="w-4 h-4 text-orange-500" />
                      ) : voteScore < 0 ? (
                        <ArrowDown className="w-4 h-4 text-blue-500" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-gray-400" />
                      )}
                      <span
                        className={`font-bold ${voteScore > 0 ? "text-orange-500" : voteScore < 0 ? "text-blue-500" : "text-gray-500"}`}
                      >
                        {voteScore}
                      </span>
                    </div>
                  </td>

                  {/* Comments */}
                  <td>
                    <div className="pa-stat-cell pa-stat-cell--comments">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-blue-500">
                        {post.commentsCount ?? post.comments ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ textAlign: "center" }}>
                    {getStatusBadge(safeStatus)}
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <Select
                      value={safeStatus}
                      onValueChange={(val) =>
                        onStatusChange(post.id, val as PostStatus)
                      }
                    >
                      <SelectTrigger className="w-[125px] h-9 bg-gray-50 hover:bg-gray-100 border-gray-200 transition-colors text-xs font-medium">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={PostStatus.Pending.toString()}
                          className="text-xs"
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                          value={PostStatus.Approved.toString()}
                          className="text-xs"
                        >
                          Approved
                        </SelectItem>
                        <SelectItem
                          value={PostStatus.Rejected.toString()}
                          className="text-xs"
                        >
                          Rejected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="pa-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 font-medium h-9"
                        onClick={() => onViewDetails(post)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete post #{String(post.id).padStart(4, "0")}{" "}
                              permanently? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(post.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
