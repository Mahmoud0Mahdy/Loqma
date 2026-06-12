import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { useEffect, useRef } from "react";
import { Toaster } from "./components/ui/sonner";

// 📦 Contexts
import { AppProvider } from "./contexts/AppContext";
import { CartProvider } from "./contexts/CartContext";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import { ChatbotProvider } from "./contexts/ChatbotContext";

// 🏗 Layouts & Components
import { AdminInitializer } from "./components/AdminInitializer";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// 🌐 Public Pages
import { HomePage } from "./pages/home/components/HomePage";
import { ShopPage } from "./pages/Shop/ShopPage";
import { ProductDetailPage } from "./pages/product/ProductDetailPage";
import { CartPage } from "./pages/cart/CartPage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { RecipesPage } from "./pages/recipe/RecipesPage";
import { RecipeDetailPage } from "./pages/recipe/RecipeDetailPage";
import { ChatbotPage } from "./pages/chatbot/ChatbotPage";
import { LoginPage } from "./pages/auth/LoginPage";

// 👤 User / Community Pages
import ProfilePage from "./pages/profile/ProfilePage";
import { CommunityPage } from "./pages/community/CommunityPage";
import { MyPostsPage } from "./pages/community/MyPostsPage";
import { PostDetailsPage } from "./pages/community/PostDetailsPage";
import { GhostCraftPage } from "./pages/GhostCraft/GhostCraftPage";
import { GhostCraftSummaryPage } from "./pages/GhostCraft/GhostCraftSummaryPage";
import { SavedRecipesPage } from "./pages/SavedItems/SavedRecipesPage";
import { SavedProductsPage } from "./pages/SavedItems/SavedProductsPage";
import { SavedPostsPage } from "./pages/SavedItems/SavedPostsPage";

// 📦 User Orders Pages
import { OrdersPage } from "./pages/orders/components/OrdersPage";
import { OrderDetailsPage } from "./pages/orders/components/OrderDetailsPage";

// 🔐 Admin Pages
import { DashboardPage } from "./admin/dashboard/DashboardPage";
import { ProductsPage } from "./admin/products/ProductsPage";
import { RecipesPage as AdminRecipesPage } from "./admin/recipes/RecipesPage";
import { UsersPage } from "./admin/users/UsersPage";
import { PostsPage } from "./admin/posts/PostsPage";
import { CategoriesPage } from "./admin/categories/CategoriesPage";
import { OrdersPage as AdminOrdersPage } from "./admin/orders/OrdersPage";
function CheckoutSessionGuard() {
  const location = useLocation();

  const previousPath = useRef<string>(location.pathname);

  useEffect(() => {
    const wasInCheckout =
      previousPath.current.startsWith("/checkout");

    const leftCheckout =
      wasInCheckout &&
      !location.pathname.startsWith("/checkout");

    if (leftCheckout) {
      sessionStorage.removeItem("checkoutStep");
      sessionStorage.removeItem("checkoutFormData");
      sessionStorage.removeItem("checkoutQuickProduct");
      sessionStorage.removeItem("checkoutQuickQuantity");

      console.log("🧹 Checkout session cleared");
    }

    previousPath.current = location.pathname;
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <CheckoutProvider>
          <ChatbotProvider>
            <AdminInitializer />

            <Toaster richColors position="top-right" />
            <CheckoutSessionGuard />

            <Routes>
              {/* 🌐 PUBLIC LAYOUT */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route path="recipe/:id" element={<RecipeDetailPage />} />
                <Route path="chatbot" element={<ChatbotPage />} />
                <Route path="login" element={<LoginPage />} />

                {/* 👤 USER & COMMUNITY */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="saved-recipes" element={<SavedRecipesPage />} />
                <Route path="saved-products" element={<SavedProductsPage />} />
                <Route path="saved-posts" element={<SavedPostsPage />} />

                <Route path="community" element={<CommunityPage />} />
                <Route path="my-posts" element={<MyPostsPage />} />
                <Route path="posts/:id" element={<PostDetailsPage />} />

                {/* 👻 GHOST CRAFT */}
                <Route path="ghost-craft" element={<GhostCraftPage />} />
                <Route path="ghostcraft" element={<GhostCraftPage />} />
                <Route
                  path="ghostcraft-summary"
                  element={<GhostCraftSummaryPage />}
                />

                {/* 📦 USER ORDERS */}
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
              </Route>

              {/* 🔐 ADMIN PROTECTED */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="recipes" element={<AdminRecipesPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
              </Route>

              {/* ❌ 404 FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ChatbotProvider>
        </CheckoutProvider>
      </CartProvider>
    </AppProvider>
  );
}
