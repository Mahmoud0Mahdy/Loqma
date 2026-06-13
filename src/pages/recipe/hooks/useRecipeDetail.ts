import { useEffect, useState, useMemo } from "react";
import { useApp } from "../../../contexts/AppContext";
import { getMatchingProducts } from "../services/cartService";
import { toast } from "sonner";
import type { Product } from "../../../contexts/AppContext";
import { getRecipeById } from "../../../api/recipeApi";
import { toggleRecipeFavorite } from "../../../api/favoriteApi";

export const useRecipeDetail = (recipeId: string | undefined) => {
  const { state, dispatch } = useApp();

  const [recipe, setRecipe] = useState<any>(null);

  // fetch recipe details
  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId);

        setRecipe({
          id: String(data.id), 
          title: data.title,
          image: data.imageUrl,
          difficulty: data.difficultyLevel,
          time: data.prepTime + " min",
          servings: data.servings,
          category: data.categoryName,
          ingredients:
            data.ingredients?.map((i: any) => i.quantityDescription) || [],
          instructions:
            data.instructions?.map((i: any) => i.step) || [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // new favorites system
  const isFavorite = useMemo(() => {
    if (!recipe) return false;
    return state.favoriteRecipes.includes(String(recipe.id));
  }, [state.favoriteRecipes, recipe]);

  const matchingProducts = recipe
    ? getMatchingProducts(state.products, recipe.ingredients)
    : [];

  const addSingleProductToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  const addAllMatchingToCart = () => {
    if (matchingProducts.length === 0) return;

    matchingProducts.forEach((product) =>
      dispatch({ type: "ADD_TO_CART", product, quantity: 1 })
    );

    toast.success(`Added ${matchingProducts.length} items to cart!`);
  };

  // FIXED FAVORITE TOGGLE
  const toggleSaveRecipe = async () => {
    if (!state.isAuthenticated) {
      toast.error("Please log in to save recipes");
      return false;
    }

    const willBeFavorite = !isFavorite;

    try {
      await toggleRecipeFavorite(recipe.id);

      dispatch({
        type: "TOGGLE_RECIPE_FAVORITE",
        recipeId: String(recipe.id),
      });

      toast.success(
        willBeFavorite
          ? "Recipe saved to favorites"
          : "Recipe removed from favorites"
      );

      return true;
    } catch (err) {
      toast.error("Something went wrong");
      return false;
    }
  };

  return {
    recipe,
    isFavorite,
    matchingProducts,
    addSingleProductToCart,
    addAllMatchingToCart,
    toggleSaveRecipe,
    allRecipes: state.recipes || [],
  };
};