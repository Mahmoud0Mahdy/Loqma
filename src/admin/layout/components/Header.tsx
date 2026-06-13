import { useApp } from "../../../contexts/AppContext";
import { Bell } from "lucide-react";

export function Header() {
  const { state } = useApp();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-0">
      <h2 className="text-xl font-bold text-gray-800">
        {/* Dashboard title */}
        Control Panel
      </h2>

      <div className="flex items-center gap-5">
        <button
          type="button"
          title="Notifications"
          className="text-gray-400 hover:text-green-600 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-gray-200"></div> {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm">
            Welcome, {state.user?.name || "Admin"}
          </span>
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
            {state.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
