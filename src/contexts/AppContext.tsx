import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../api/recipeApi";

import { getFavoriteProducts, getSavedRecipes } from "../api/favoriteApi";

// ================= TYPES =================

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryId: number;
  image: string;
  imageUrl: string;
  description: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  inStock: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  difficulty:
    | "Easy"
    | "Intermediate"
    | "Medium"
    | "Advanced"
    | "Hard"
    | "Expert";
}

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  isActive?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: "product" | "recipe";
}

// ================= STATE =================

interface AppState {
  user: User | null;
  isAuthenticated: boolean;

  products: Product[];
  recipes: Recipe[];
  users: User[];
  communityPosts: CommunityPost[];

  categories: Category[];

  favoriteProducts: string[];
  favoriteRecipes: string[];
}

// ================= ACTIONS =================

type AppAction =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; productId: string }
  | { type: "SET_PRODUCTS"; products: Product[] }
  | { type: "SET_RECIPES"; recipes: Recipe[] }
  | { type: "ADD_RECIPE"; recipe: Recipe }
  | { type: "UPDATE_RECIPE"; recipe: Recipe }
  | { type: "DELETE_RECIPE"; recipeId: string }
  | { type: "SET_FAVORITE_PRODUCTS"; productIds: string[] }
  | { type: "SET_FAVORITE_RECIPES"; recipeIds: string[] }
  | { type: "TOGGLE_PRODUCT_FAVORITE"; productId: string }
  | { type: "TOGGLE_RECIPE_FAVORITE"; recipeId: string };

// ================= INIT =================

const savedUser = localStorage.getItem("user");
const parsedUser: User | null = savedUser ? JSON.parse(savedUser) : null;

const initialState: AppState = {
  user: parsedUser,
  isAuthenticated: !!parsedUser,

  products: [],
  recipes: [],
  users: [],
  communityPosts: [],
  categories: [],

  favoriteProducts: [],
  favoriteRecipes: [],
};

// ================= REDUCER =================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.products };

    case "ADD_PRODUCT":
      return { ...state, products: [action.product, ...state.products] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.product.id ? action.product : p,
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.productId),
      };

    case "SET_RECIPES":
      return { ...state, recipes: action.recipes };

    case "ADD_RECIPE":
      return { ...state, recipes: [action.recipe, ...state.recipes] };

    case "UPDATE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.recipe.id ? action.recipe : r,
        ),
      };

    case "DELETE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.recipeId),
      };

    case "SET_FAVORITE_PRODUCTS":
      return { ...state, favoriteProducts: action.productIds };

    case "SET_FAVORITE_RECIPES":
      return { ...state, favoriteRecipes: action.recipeIds };

    case "TOGGLE_PRODUCT_FAVORITE": {
      const exists = state.favoriteProducts.includes(action.productId);
      return {
        ...state,
        favoriteProducts: exists
          ? state.favoriteProducts.filter((id) => id !== action.productId)
          : [...state.favoriteProducts, action.productId],
      };
    }

    case "TOGGLE_RECIPE_FAVORITE": {
      const exists = state.favoriteRecipes.includes(action.recipeId);
      return {
        ...state,
        favoriteRecipes: exists
          ? state.favoriteRecipes.filter((id) => id !== action.recipeId)
          : [...state.favoriteRecipes, action.recipeId],
      };
    }

    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.user));
      return { ...state, user: action.user, isAuthenticated: true };

    case "LOGOUT":
      localStorage.clear();
      sessionStorage.clear();

      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}

// ================= CONTEXT =================

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchRecipes = async () => {
    const data = await getAllRecipes();
    dispatch({ type: "SET_RECIPES", recipes: data });
  };

  const fetchFavorites = async () => {
    try {
      const products = (await getFavoriteProducts()) || [];
      const recipes = (await getSavedRecipes()) || [];

      dispatch({
        type: "SET_FAVORITE_PRODUCTS",
        productIds: products.map((p: any) => String(p.productId)),
      });

      dispatch({
        type: "SET_FAVORITE_RECIPES",
        recipeIds: recipes.map((r: any) => String(r.recipeId ?? r.id)),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchFavorites();
    }
  }, [state.isAuthenticated]);

  const addRecipe = async (data: any) => {
    await createRecipe(data);
  };

  const editRecipe = async (id: string, data: any) => {
    await updateRecipe(id, data);
  };

  const removeRecipe = async (id: string) => {
    await deleteRecipe(id);
    dispatch({ type: "DELETE_RECIPE", recipeId: id });
  };

  const fetchRecipeById = async (id: string) => {
    return await getRecipeById(id);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        fetchRecipes,
        addRecipe,
        editRecipe,
        removeRecipe,
        fetchRecipeById,
        fetchFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
