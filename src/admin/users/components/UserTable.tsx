import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../../contexts/AppContext";
import { updateUserStatus } from "../../../api/adminApi";
import "../components/users-admin.css";

export function UserTable({ users, onRefresh }) {
  const { state } = useApp();

  const handleToggleStatus = async (userId, currentStatus, role) => {
    if (userId === state.user?.id) {
      toast.error("Cannot modify your own account status");
      return;
    }

    if (role?.toLowerCase() === "admin") {
      toast.error("Admin accounts cannot be modified");
      return;
    }

    try {
      await updateUserStatus(userId, !currentStatus);

      toast.success(`User is now ${!currentStatus ? "Active" : "Inactive"}`);

      onRefresh();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="ua-table-wrap">
      <div style={{ overflowX: "auto" }}>
        <table className="ua-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {/* User identity */}
                <td>
                  <div className="ua-user">
                    <div className="ua-avatar">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>

                    <div className="ua-user-name">{user.name}</div>
                  </div>
                </td>

                {/* User email */}
                <td className="ua-email">{user.email}</td>

                {/* User role */}
                <td>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </td>

                {/* Account status */}
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>

                {/* Enable / disable account */}
                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() =>
                      handleToggleStatus(user.id, user.isActive, user.role)
                    }
                    disabled={
                      user.id === state.user?.id ||
                      user.role?.toLowerCase() === "admin"
                    }
                  >
                    {user.isActive ? (
                      <ShieldOff className="w-4 h-4 text-red-500 hover:text-red-600" />
                    ) : (
                      <Shield className="w-4 h-4 text-green-500 hover:text-green-600" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
