import { useState, useEffect } from "react";
import { useApp } from "../../../contexts/AppContext";
import type { Recipe } from "../../../contexts/AppContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { getCategories } from "../../../api/adminApi";
import { getRecipeById } from "../../../api/recipeApi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { toast } from "sonner";

interface RecipeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecipe: Recipe | null;
  onSuccess: () => Promise<void>;
}

const defaultFormData = {
  title: "",
  image: "",
  time: "",
  servings: "",
  category: "",
  difficulty: "Easy" as
    | "Easy"
    | "Intermediate"
    | "Medium"
    | "Advanced"
    | "Hard"
    | "Expert",
  ingredients: "",
  instructions: "",
};

const difficulties = [
  "Easy",
  "Intermediate",
  "Medium",
  "Advanced",
  "Hard",
  "Expert",
] as const;

export function RecipeFormDialog({
  isOpen,
  onClose,
  editingRecipe,
  onSuccess,
}: RecipeFormDialogProps) {
  const { addRecipe, editRecipe } = useApp();

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Load recipe categories when the dialog opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(1);
        setCategories(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Load recipe details when editing an existing recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!editingRecipe) {
        setFormData(defaultFormData);
        return;
      }

      try {
        const data = await getRecipeById(editingRecipe.id);

        const matchedCategory = categories.find(
          (c) => c.name.toLowerCase() === data.categoryName?.toLowerCase(),
        );

        setFormData({
          title: data.title || "",
          image: data.imageUrl || "",
          time: data.prepTime?.toString() || "",
          servings: data.servings?.toString() || "",
          category: matchedCategory ? matchedCategory.id.toString() : "",
          difficulty: data.difficultyLevel || "Easy",
          ingredients:
            data.ingredients
              ?.map((i: any) => i.quantityDescription)
              .join("\n") || "",
          instructions:
            data.instructions?.map((i: any) => i.step).join("\n") || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load recipe data");
      }
    };

    if (isOpen && categories.length > 0) {
      fetchRecipe();
    }
  }, [editingRecipe, isOpen, categories]);

  // Create a new recipe or update an existing one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const servingsNumber = parseInt(formData.servings) || 1;

      const apiRecipeData = {
        title: formData.title,
        imageUrl:
          formData.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        difficultyLevel: formData.difficulty,
        prepTime: Number(formData.time),
        servings: servingsNumber,
        categoryId: Number(formData.category),

        ingredients: formData.ingredients
          .split("\n")
          .filter((i) => i.trim())
          .map((item) => ({
            quantityDescription: item,
          })),

        instructions: formData.instructions
          .split("\n")
          .filter((i) => i.trim())
          .map((step) => ({
            step,
          })),
      };

      if (editingRecipe) {
        await editRecipe(Number(editingRecipe.id), apiRecipeData);
        toast.success("Recipe updated successfully");
      } else {
        await addRecipe(apiRecipeData);
        toast.success("Recipe added successfully");
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Dialog header */}
        <DialogHeader>
          <DialogTitle>
            {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipe title */}
          <div>
            <Label>Recipe Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Recipe image URL */}
          <div>
            <Label>Image URL *</Label>

            <Input
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.value,
                })
              }
            />

            {/* Image preview */}
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-24 h-24 mt-3 rounded object-cover border"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/no-image.png";
                }}
              />
            )}
          </div>

          {/* Cooking time and servings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cooking Time *</Label>

              <Input
                type="number"
                min="1"
                value={formData.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    time: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Servings *</Label>

              <Input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    servings: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          {/* Category and difficulty selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category selector */}
            <div>
              <Label>Category *</Label>

              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty selector */}
            <div>
              <Label>Difficulty *</Label>

              <Select
                value={formData.difficulty}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    difficulty: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <Label>Ingredients *</Label>

            <Textarea
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingredients: e.target.value,
                })
              }
              rows={4}
              required
            />
          </div>

          {/* Instructions list */}
          <div>
            <Label>Instructions *</Label>

            <Textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructions: e.target.value,
                })
              }
              rows={4}
              required
            />
          </div>

          {/* Form actions */}
          <div className="flex gap-2 justify-end pt-4">
            {/* Close dialog */}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {/* Submit form */}
            <Button
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Loading..."
                : editingRecipe
                  ? "Update Recipe"
                  : "Add Recipe"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
