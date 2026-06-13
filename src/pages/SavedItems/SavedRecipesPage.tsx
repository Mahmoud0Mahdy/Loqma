import { Navigate, useNavigate } from "react-router-dom";
import { Heart, Clock, Users, ChefHat } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { toggleRecipeFavorite, getSavedRecipes } from "../../api/favoriteApi";
import { useEffect, useState } from "react";

export function SavedRecipesPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  const fetchSaved = async () => {
    try {
      const data = await getSavedRecipes();
      setSavedRecipes(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchSaved();
    }
  }, [state.isAuthenticated]);

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleFavorite = async (recipeId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await toggleRecipeFavorite(recipeId);
      await fetchSaved();

      toast.success("Updated favorites");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Saved Recipes ({savedRecipes.length})</CardTitle>
          </CardHeader>

          <CardContent>
            {savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <Card
                    key={recipe.recipeId}
                    className="group cursor-pointer hover:shadow-xl transition-shadow bg-white border-0 shadow-md"
                    onClick={() => navigate(`/recipe/${recipe.recipeId}`)}
                  >
                    <CardContent className="p-0">
                      {/* IMAGE */}
                      <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                        <ImageWithFallback
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Difficulty */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-500 text-white">
                            {recipe.difficultyLevel}
                          </Badge>
                        </div>

                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/90 hover:bg-white p-1 h-8 w-8"
                            onClick={(e) => toggleFavorite(recipe.recipeId, e)}
                          >
                            <Heart
                              size={16}
                              className="fill-red-500 text-red-500"
                            />
                          </Button>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-6">
                        <div className="mb-2">
                          <Badge variant="outline" className="capitalize">
                            {recipe.categoryName}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {recipe.title}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            <span>{recipe.prepTime} min</span>
                          </div>

                          <div className="flex items-center">
                            <Users size={16} className="mr-1" />
                            <span>{recipe.servings || "N/A"}</span>
                          </div>

                          <div className="flex items-center">
                            <ChefHat size={16} className="mr-1" />
                            <span>{recipe.difficultyLevel}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        >
                          View Recipe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No saved recipes yet</p>
                <Button onClick={() => navigate("/recipes")} className="mt-4">
                  Browse Recipes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
