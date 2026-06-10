import { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import type { Recipe } from "../../contexts/AppContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Search,
  Plus,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getAdminRecipes } from "../../api/recipeApi";
import { getCategories } from "../../api/adminApi";

import { RecipeStats } from "./components/RecipeStats";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeFormDialog } from "./components/RecipeFormDialog";

export function RecipesPage() {
  const { state, dispatch } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [recipeCategories, setRecipeCategories] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem(
      "adminRecipesCurrentPage"
    );
    return savedPage ? Number(savedPage) : 1;
  });

  const [totalPages, setTotalPages] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] =
    useState<Recipe | null>(null);

  const [loading, setLoading] = useState(false);

  // ================= FETCH RECIPES =================
  const fetchRecipes = async () => {
    setLoading(true);

    try {
      const response = await getAdminRecipes(
        currentPage,
        30
      );

      setTotalPages(
        Math.ceil(
          response.totalCount / response.pageSize
        )
      );

      const mappedRecipes: Recipe[] =
        response.data.map((r: any) => ({
          id: r.id?.toString() || "",
          title: r.title || "",
          image: r.imageUrl || "",
          time: `${r.prepTime || 0} min`,
          servings: `${r.servings || 1} ${
            (r.servings || 1) === 1
              ? "person"
              : "people"
          }`,
          category: r.categoryName || "",
          difficulty:
            r.difficultyLevel || "Easy",

          ingredients:
            r.ingredients?.map(
              (i: any) =>
                i.quantityDescription
            ) || [],

          instructions:
            r.instructions?.map(
              (i: any) => i.step
            ) || [],
        }));

      dispatch({
        type: "SET_RECIPES",
        recipes: mappedRecipes,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const data = await getCategories(1);
      setRecipeCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem(
      "adminRecipesCurrentPage",
      currentPage.toString()
    );
  }, [currentPage]);

  // ================= FILTER =================
  const filteredRecipes = state.recipes.filter(
    (recipe) => {
      const searchLower =
        searchQuery.toLowerCase();

      const matchesSearch =
        (recipe.title || "")
          .toLowerCase()
          .includes(searchLower) ||
        (recipe.category || "")
          .toLowerCase()
          .includes(searchLower);

      const matchesCategory =
        selectedCategory === "all" ||
        recipe.category
          ?.toLowerCase()
          .trim() ===
          selectedCategory
            ?.toLowerCase()
            .trim();

      return (
        matchesSearch && matchesCategory
      );
    }
  );

  const currentRecipes = filteredRecipes;

  const handleOpenDialog = (
    recipe: Recipe | null = null
  ) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Recipe Management
          </h1>

          <p className="text-gray-600">
            Manage your recipe collection
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {/* Search + Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="pl-10"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={
                setSelectedCategory
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All
                </SelectItem>

                {recipeCategories.map(
                  (cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.name}
                    >
                      {cat.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <RecipeStats recipes={state.recipes} />

      {/* Loading */}
      {loading && (
        <Card className="p-6 text-center">
          <p>Loading recipes...</p>
        </Card>
      )}

      {/* Recipes */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecipes.map(
            (recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={
                  handleOpenDialog
                }
              />
            )
          )}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        filteredRecipes.length ===
          0 && (
          <Card className="p-12 text-center">
            <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No recipes found</p>
          </Card>
        )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (p) => p - 1
              )
            }
          >
            <ChevronLeft />
          </Button>

          <span className="px-4 py-2 font-medium">
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <Button
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (p) => p + 1
              )
            }
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <RecipeFormDialog
        isOpen={isDialogOpen}
        onClose={() =>
          setIsDialogOpen(false)
        }
        editingRecipe={
          editingRecipe
        }
        onSuccess={fetchRecipes}
      />
    </div>
  );
}