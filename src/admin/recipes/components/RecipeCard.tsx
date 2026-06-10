import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2, Clock, Users } from "lucide-react";
import type { Recipe } from "../../../contexts/AppContext";
import { useApp } from "../../../contexts/AppContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onEdit }: RecipeCardProps) {
  const { removeRecipe, dispatch } = useApp();

  const handleDelete = async () => {
    try {
      await removeRecipe(recipe.id);
      dispatch({ type: "DELETE_RECIPE", recipeId: recipe.id });
      toast.success(`${recipe.title} has been deleted`);
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };

  const image = (recipe as any).imageUrl || recipe.image;
  const prepTime =
    (recipe as any).prepTime
      ? `${(recipe as any).prepTime} min`
      : recipe.time;

  const category =
    (recipe as any).categoryName || recipe.category;

  // 🔥 Difficulty Parsing
  let rawDifficulty = (
    (recipe as any).difficulty ??
    (recipe as any).difficultyLevel ??
    "Easy"
  )
    .toString()
    .toLowerCase()
    .trim();

  let diffBg =
    "bg-green-100 text-green-700 hover:bg-green-200";
  let diffLabel = "Easy";

  if (
    rawDifficulty === "intermediate" ||
    rawDifficulty === "1"
  ) {
    diffBg =
      "bg-blue-100 text-blue-700 hover:bg-blue-200";
    diffLabel = "Intermediate";
  } else if (
    rawDifficulty === "medium" ||
    rawDifficulty === "2"
  ) {
    diffBg =
      "bg-orange-100 text-orange-700 hover:bg-orange-200";
    diffLabel = "Medium";
  } else if (
    rawDifficulty === "advanced" ||
    rawDifficulty === "3"
  ) {
    diffBg =
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
    diffLabel = "Advanced";
  } else if (
    rawDifficulty === "hard" ||
    rawDifficulty === "4"
  ) {
    diffBg =
      "bg-red-100 text-red-700 hover:bg-red-200";
    diffLabel = "Hard";
  } else if (
    rawDifficulty === "expert" ||
    rawDifficulty === "5"
  ) {
    diffBg =
      "bg-purple-100 text-purple-700 hover:bg-purple-200";
    diffLabel = "Expert";
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <img
        src={image}
        alt={recipe.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold text-gray-900 mb-2 line-clamp-1"
          title={recipe.title}
        >
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{prepTime}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{recipe.servings}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700 font-medium"
          >
            {category}
          </Badge>

          <Badge
            className={`text-xs font-bold border-none ${diffBg}`}
          >
            {diffLabel}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(recipe)}
            className="flex-1 h-8 text-xs font-medium"
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Recipe
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  {recipe.title}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}