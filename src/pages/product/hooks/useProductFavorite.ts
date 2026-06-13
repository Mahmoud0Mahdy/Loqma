import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useApp, type Product } from "../../../contexts/AppContext";
import { toggleProductFavorite } from "../../../api/favoriteApi";

export const useProductFavorite = (product: Product) => {
  const { state, dispatch } = useApp();

  const productId = String(product.id);

  const isFavorite = useMemo(() => {
    return state.favoriteProducts.includes(productId);
  }, [state.favoriteProducts, productId]);

  const toggleSaveProduct = useCallback(async () => {
    if (!state.isAuthenticated) {
      toast.error("Please log in to save products", {
        duration: 1500,
      });
      return false;
    }

    const willBeFavorite = !isFavorite;

    try {
      // API CALL
      await toggleProductFavorite(productId);

      dispatch({
        type: "TOGGLE_PRODUCT_FAVORITE",
        productId,
      });

      toast.success(
        willBeFavorite
          ? "Product saved to favorites"
          : "Product removed from favorites",
        { duration: 1200 }
      );

      return true;
    } catch (err) {
      console.error("Favorite error:", err);
      toast.error("Something went wrong");
      return false;
    }
  }, [state.isAuthenticated, isFavorite, productId, dispatch]);

  return { isFavorite, toggleSaveProduct };
};