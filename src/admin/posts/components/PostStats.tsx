import { Card } from "../../../components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "../components/posts-admin.css";

enum PostStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface PostStatsProps {
  posts: any[];
}

export function PostStats({ posts }: PostStatsProps) {
  const getStatus = (post: any): PostStatus => {
    return (
      post.status ||
      post.postStatus ||
      PostStatus.Pending
    );
  };

  const pendingCount = posts.filter(
    (p) => getStatus(p) === PostStatus.Pending
  ).length;

  const approvedCount = posts.filter(
    (p) => getStatus(p) === PostStatus.Approved
  ).length;

  const rejectedCount = posts.filter(
    (p) => getStatus(p) === PostStatus.Rejected
  ).length;

  return (
    <div className="ps-stats-wrapper">
      <Card className="ps-total-card">
        <div className="ps-total-icon">
          <FileText size={22} />
        </div>

        <p className="ps-total-label">TOTAL POSTS</p>
        <p className="ps-total-value">{posts.length}</p>
      </Card>

      <div className="ps-mini-grid">
        <Card className="ps-mini-card">
          <div className="ps-mini-icon ps-mini-icon--orange">
            <Clock size={18} />
          </div>

          <p className="ps-mini-value ps-mini-value--orange">
            {pendingCount}
          </p>

          <p className="ps-mini-label">PENDING</p>
        </Card>

        <Card className="ps-mini-card">
          <div className="ps-mini-icon ps-mini-icon--green">
            <CheckCircle2 size={18} />
          </div>

          <p className="ps-mini-value ps-mini-value--green">
            {approvedCount}
          </p>

          <p className="ps-mini-label">APPROVED</p>
        </Card>

        <Card className="ps-mini-card">
          <div className="ps-mini-icon ps-mini-icon--red">
            <XCircle size={18} />
          </div>

          <p className="ps-mini-value ps-mini-value--red">
            {rejectedCount}
          </p>

          <p className="ps-mini-label">REJECTED</p>
        </Card>
      </div>
    </div>
  );
}