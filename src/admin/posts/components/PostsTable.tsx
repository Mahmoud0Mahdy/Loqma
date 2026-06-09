import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye, Trash2, Heart, MessageCircle } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import "../components/posts-admin.css"; // ✅ عدّل المسار حسب مشروعك

export enum PostStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Deleted = 3,
}

interface PostsTableProps {
  posts: any[];
  onDelete: (postId: number | string) => void;
  onViewDetails: (post: any) => void;
  onStatusChange: (postId: number | string, newStatus: PostStatus) => void;
}

export function PostsTable({ posts, onDelete, onViewDetails, onStatusChange }: PostsTableProps) {
  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.Pending:
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[11px]">Pending</Badge>;
      case PostStatus.Accepted:
        return <Badge className="bg-green-500 hover:bg-green-600 text-[11px]">Accepted</Badge>;
      case PostStatus.Rejected:
        return <Badge className="bg-red-500 hover:bg-red-600 text-[11px]">Rejected</Badge>;
      case PostStatus.Deleted:
        return <Badge variant="secondary" className="bg-gray-200 text-gray-600 text-[11px]">Deleted</Badge>;
      default:
        return <Badge variant="outline" className="text-[11px]">Unknown</Badge>;
    }
  };

  const parseStatus = (raw: any): PostStatus => {
    if (typeof raw === "number") return raw as PostStatus;
    if (typeof raw === "string") {
      const n = parseInt(raw, 10);
      if (!isNaN(n)) return n as PostStatus;
    }
    return PostStatus.Pending;
  };

  return (
    <div className="pa-table-wrap bg-white">
      <div style={{ overflowX: "auto" }}>
        <table className="pa-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Author</th>
              <th>Title</th>
              <th style={{ textAlign: "center" }}>Saves</th>
              <th style={{ textAlign: "center" }}>Comments</th>
              <th>Date</th>
              <th>Status</th>
              <th>Change</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const safeStatus = parseStatus(post.status ?? post.postStatus ?? post.safeStatus);
              const isTerminal = safeStatus === PostStatus.Deleted;

              return (
                <tr key={post.id}>
                  {/* ID */}
                  <td className="pa-post-id">
                    #{String(post.id).padStart(4, "0")}
                  </td>

                  {/* Author */}
                  <td>
                    <div className="pa-author">
                      <div className="pa-avatar">
                        {(post.userName || post.username || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="pa-author-name">
                        {post.userName || post.username || "Unknown"}
                      </span>
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
                    <div className="pa-stat-cell pa-stat-cell--saves">
                      <Heart size={13} />
                      {post.votes ?? post.upvotes ?? post.voteCount ?? 0}
                    </div>
                  </td>

                  {/* Comments */}
                  <td>
                    <div className="pa-stat-cell pa-stat-cell--comments">
                      <MessageCircle size={13} />
                      {post.commentsCount ?? post.comments ?? 0}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="pa-date">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}
                  </td>

                  {/* Status badge */}
                  <td>{getStatusBadge(safeStatus)}</td>

                  {/* Status dropdown */}
                  <td>
                    <Select
                      value={safeStatus.toString()}
                      onValueChange={(val) => onStatusChange(post.id, parseInt(val) as PostStatus)}
                      disabled={isTerminal}
                    >
                      <SelectTrigger className="w-[118px] h-7 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostStatus.Pending.toString()}>Pending</SelectItem>
                        <SelectItem value={PostStatus.Accepted.toString()}>Accepted</SelectItem>
                        <SelectItem value={PostStatus.Rejected.toString()}>Rejected</SelectItem>
                        <SelectItem value={PostStatus.Deleted.toString()}>Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="pa-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-gray-500 hover:text-gray-900"
                        onClick={() => onViewDetails(post)}
                      >
                        <Eye size={13} className="mr-1" /> View
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete post #{String(post.id).padStart(4, "0")} permanently? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(post.id)} className="bg-red-500 hover:bg-red-600">
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
