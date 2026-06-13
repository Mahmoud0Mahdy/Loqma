import { Card } from "../../../components/ui/card";
import type { User } from "../../../contexts/AppContext";
import { Users, UserCheck, UserX } from "lucide-react";
import "../components/users-admin.css";

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const activeCount = users.filter((user) => user.isActive).length;
  const inactiveCount = users.filter((user) => !user.isActive).length;

  return (
    <div className="us-stats-wrapper">
      {/* Total users summary */}
      <Card className="us-total-card">
        <div className="us-total-icon">
          <Users size={22} />
        </div>

        <p className="us-total-label">TOTAL USERS</p>
        <p className="us-total-value">{users.length}</p>
      </Card>

      {/* Active and inactive user breakdown */}
      <div className="us-mini-grid">
        <Card className="us-mini-card">
          <div className="us-mini-icon us-mini-icon--green">
            <UserCheck size={18} />
          </div>

          <p className="us-mini-value us-mini-value--green">{activeCount}</p>

          <p className="us-mini-label">ACTIVE</p>
        </Card>

        <Card className="us-mini-card">
          <div className="us-mini-icon us-mini-icon--red">
            <UserX size={18} />
          </div>

          <p className="us-mini-value us-mini-value--red">{inactiveCount}</p>

          <p className="us-mini-label">INACTIVE</p>
        </Card>
      </div>
    </div>
  );
}
