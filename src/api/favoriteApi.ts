import axiosInstance from "./axiosInstance";

/* =========================  Product Favorites  ========================= */

// Add or remove a product from favorites
export const toggleProductFavorite = async (productId: number | string) => {
  const res = await axiosInstance.post(`/Favorites/${productId}/save`);

  return res.data;
};

// Get all favorite products for the current user
export const getFavoriteProducts = async () => {
  const res = await axiosInstance.get("/Favorites");

  return res.data;
};

/* =========================  Recipe Favorites  ========================= */

// Add or remove a recipe from saved recipes
export const toggleRecipeFavorite = async (recipeId: number | string) => {
  const res = await axiosInstance.post(`/SavedRecipes/${recipeId}/save`);

  return res.data;
};

// Get all saved recipes for the current user
export const getSavedRecipes = async () => {
  const res = await axiosInstance.get("/SavedRecipes");

  return res.data;
};
