import { Button } from "../../components/ui/button";
import { LogOut, KeyRound } from "lucide-react";

export default function ProfileHeader({
  user,
  onLogout,
  onEdit,
  onChangePassword,
}: any) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl mb-6 flex justify-between items-center">

      <div className="flex items-center gap-4">
        <div
          className="bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ width: "80px", height: "80px" }}
        >
          {(user.fullName || user.email || "U")
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {user.fullName}
          </h2>

          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2">

        <Button
          onClick={onEdit}
          variant="outline"
          className="px-4"
        >
          Edit
        </Button>

        <Button
          onClick={onChangePassword}
          variant="outline"
          className="px-4"
        >
          <KeyRound size={16} className="mr-2" />
          Change Password
        </Button>

        <Button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>

      </div>
    </div>
  );
}