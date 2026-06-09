import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../../contexts/AppContext";
import {
  LayoutDashboard,
  Package,
  UtensilsCrossed,
  Users,
  MessageSquare,
  Shield,
  LogOut,
  Layers, // ✅ جديد
  ShoppingCart // ✅ New Import
} from "lucide-react";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/recipes", label: "Recipes", icon: UtensilsCrossed },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/posts", label: "Posts", icon: MessageSquare },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm"
      style={{ width: "256px" }}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tight uppercase">
            Freshmart
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-4">
          Administration
        </p>

        {navItems.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-green-600 text-white shadow-md shadow-green-100/50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-green-600"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50 bg-gray-50/50 shrink-0 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
            {state.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-xs truncate">
              {state.user?.name}
            </p>
            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-white py-3 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
          onClick={() => navigate("/")}
        >
          <LogOut className="w-4 h-4" />
          <span>Back to site</span>
        </button>
      </div>
    </aside>
  );
}