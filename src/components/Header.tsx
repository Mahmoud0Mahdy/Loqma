import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Shield, Heart } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

import "./header.css";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/shop" },
  { name: "Recipes", path: "/recipes" },
  { name: "Ghost Craft", path: "/ghost-craft" },
  { name: "Community", path: "/community" },
  { name: "Orders", path: "/orders" },
  { name: "Chatbot", path: "/chatbot" },
];

export function Header() {
  const { state } = useApp();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const protectedRoutes = ["/ghost-craft", "/community", "/orders", "/chatbot"];

  const requireLogin = (path: string) => {
    if (!state.isAuthenticated) {
      toast.error("Please login first to use this feature");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const cartItemsCount = (cart || []).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const isAdmin = state.user?.role === "admin" || state.user?.role === "Admin";

  const favoritesCount =
    (state.user?.savedRecipes?.length || 0) +
    (state.user?.savedProducts?.length || 0);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isAdminActive = location.pathname.startsWith("/admin");

  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="header-inner">
          
          {/* LOGO */}
          <div
            className="header-logo-box"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo/Loqma - Concept 2.svg"
              alt="Loqma Logo"
              className="header-logo"
            />
          </div>

          {/* DESKTOP NAV */}
          <nav className="header-desktop-nav">
            <div className="header-nav-list">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (protectedRoutes.includes(item.path)) {
                      requireLogin(item.path);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`header-nav-link ${isActive(item.path) ? "active" : ""}`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="header-actions">
              {/* ADMIN */}
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className={`header-icon-btn ${isAdminActive ? "active" : ""}`}
                  title="Admin Dashboard"
                >
                  <Shield size={20} />
                </button>
              )}

              {/* CART */}
              <div className="header-cart-wrapper">
                <button
                  type="button"
                  onClick={() => requireLogin("/cart")}
                  className="header-icon-btn"
                  title="Shopping Cart"
                >
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="header-cart-badge">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* FAVORITES */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="header-icon-btn"
                    title="Favorites"
                  >
                    <Heart
                      size={20}
                      color={favoritesCount > 0 ? "#ef4444" : "currentColor"}
                      fill={favoritesCount > 0 ? "#ef4444" : "none"}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => requireLogin("/saved-recipes")} style={{ cursor: "pointer" }}>
                    Saved Recipes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => requireLogin("/saved-products")} style={{ cursor: "pointer" }}>
                    Saved Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => requireLogin("/saved-posts")} style={{ cursor: "pointer" }}>
                    Saved Posts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* USER */}
              <button
                onClick={() =>
                  navigate(state.isAuthenticated ? "/profile" : "/login")
                }
                className="header-icon-btn"
              >
                <User size={20} />
              </button>
            </div>
          </nav>

          {/* MOBILE NAV */}
          <div className="header-mobile-actions">
            {/* CART */}
            <div className="header-cart-wrapper">
              <button
                onClick={() => requireLogin("/cart")}
                className="header-mobile-icon-btn"
              >
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="header-cart-badge">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* FAVORITES */}
            <button
              onClick={() => requireLogin("/saved-products")}
              className="header-mobile-icon-btn"
            >
              <Heart
                size={22}
                color={favoritesCount > 0 ? "#ef4444" : "currentColor"}
                fill={favoritesCount > 0 ? "#ef4444" : "none"}
              />
            </button>

            {/* MENU BUTTON */}
            <button
              className="header-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu">
            <div className="header-mobile-menu-inner">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (protectedRoutes.includes(item.path)) {
                      requireLogin(item.path);
                    } else {
                      navigate(item.path);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`header-mobile-item ${isActive(item.path) ? "active" : ""}`}
                >
                  {item.name}
                </button>
              ))}

              {/* ADMIN */}
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className={`header-mobile-item header-mobile-admin-item ${isAdminActive ? "active" : ""}`}
                >
                  <Shield size={18} />
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}