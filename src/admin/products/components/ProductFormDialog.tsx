import { useState, useEffect } from "react";
import { useApp } from "../../../contexts/AppContext";
import type { Product } from "../../../contexts/AppContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { DialogClose } from "../../../components/ui/dialog";
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

import axiosInstance from "../../../api/axiosInstance";
import { getCategories } from "../../../api/adminApi";

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
}

const defaultFormData = {
  name: "",
  price: "",
  category: "",
  categoryId: 0,
  image: "",
  description: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  fiber: "",
  inStock: true,
};

// ================= PRODUCT FORM DIALOG =================
export function ProductFormDialog({
  isOpen,
  onClose,
  editingProduct,
}: ProductFormDialogProps) {
  const { dispatch } = useApp();

  const [formData, setFormData] = useState(defaultFormData);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    // ================= LOAD PRODUCT CATEGORIES =================
    const fetchCategories = async () => {
      try {
        const res = await getCategories(2);
        setCategories(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  // ================= LOAD EDITING PRODUCT DATA =================
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        categoryId: editingProduct.categoryId || 0,
        image: editingProduct.image,
        description: editingProduct.description || "",
        calories: editingProduct.nutrition?.calories?.toString() || "",
        protein:
          editingProduct.nutrition?.protein?.replace(/[^0-9.]/g, "") || "",
        carbs: editingProduct.nutrition?.carbs?.replace(/[^0-9.]/g, "") || "",
        fat: editingProduct.nutrition?.fat?.replace(/[^0-9.]/g, "") || "",
        fiber: editingProduct.nutrition?.fiber?.replace(/[^0-9.]/g, "") || "",
        inStock: editingProduct.inStock,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingProduct, isOpen]);

  // ================= SYNC CATEGORY ID AFTER LOADING =================
  useEffect(() => {
    if (editingProduct && categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        categoryId: editingProduct.categoryId,
      }));
    }
  }, [categories, editingProduct]);

  // ================= HANDLE FORM SUBMISSION =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.categoryId) {
      toast.error("Select category");
      return;
    }

    // ================= VALIDATE NUTRITION VALUES =================
    const nutritionFields = [
      { name: "Calories", value: formData.calories },
      { name: "Protein", value: formData.protein },
      { name: "Carbs", value: formData.carbs },
      { name: "Fat", value: formData.fat },
      { name: "Fiber", value: formData.fiber },
    ];

    let isAnyNutritionGreaterThanZero = false;

    for (const field of nutritionFields) {
      if (field.value !== "") {
        const numValue = parseFloat(field.value);

        if (numValue > 999) {
          toast.error(`${field.name} cannot exceed 999`);
          return;
        }

        if (numValue < 0) {
          toast.error(`${field.name} cannot be less than 0`);
          return;
        }

        if (numValue > 0) {
          isAnyNutritionGreaterThanZero = true;
        }
      }
    }

    if (!isAnyNutritionGreaterThanZero) {
      toast.error("At least one nutrition value must be greater than 0");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      inStock: formData.inStock,
      imageUrl: formData.image,
      categoryId: formData.categoryId,
      nutrition: {
        calories: parseFloat(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
        fiber: parseFloat(formData.fiber) || 0,
      },
    };

    try {
      // ================= UPDATE EXISTING PRODUCT =================
      if (editingProduct) {
        await axiosInstance.put(`/Products/${editingProduct.id}`, payload);

        dispatch({
          type: "UPDATE_PRODUCT",
          product: {
            ...payload,
            id: editingProduct.id,
            category: formData.category,
            image: formData.image,
            imageUrl: formData.image,
            nutrition: {
              calories: payload.nutrition.calories,
              protein: `${formData.protein}g`,
              carbs: `${formData.carbs}g`,
              fat: `${formData.fat}g`,
              fiber: `${formData.fiber}g`,
            },
          },
        });

        toast.success("Updated successfully");
      } else {
        // ================= CREATE NEW PRODUCT =================
        const res = await axiosInstance.post(`/Products`, payload);

        dispatch({
          type: "ADD_PRODUCT",
          product: {
            ...payload,
            id: res.data.id.toString(),
            category: formData.category,
            image: formData.image,
            imageUrl: formData.image,
            nutrition: {
              calories: payload.nutrition.calories,
              protein: `${formData.protein}g`,
              carbs: `${formData.carbs}g`,
              fat: `${formData.fat}g`,
              fiber: `${formData.fiber}g`,
            },
          },
        });

        toast.success("Added successfully");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="productPrice">Price *</Label>
              <Input
                id="productPrice"
                type="number"
                min="0"
                step="any"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Category & Stock Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productCategory">Category *</Label>

              <Select
                value={
                  formData.categoryId ? formData.categoryId.toString() : ""
                }
                onValueChange={(value) => {
                  const selected = categories.find(
                    (c) => c.id.toString() === value,
                  );

                  setFormData({
                    ...formData,
                    category: selected?.name || "",
                    categoryId: selected?.id || 0,
                  });
                }}
              >
                <SelectTrigger id="productCategory" aria-label="Category">
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

            <div className="flex items-center gap-2 pt-6">
              <input
                title="In Stock"
                id="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inStock: e.target.checked,
                  })
                }
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>

          {/* Product Image URL & Preview */}
          <div>
            <Label htmlFor="imageUrl">Image URL *</Label>

            <Input
              id="imageUrl"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
            />

            {/* Image Preview */}
            {formData.image && (
              <img
                alt="Product preview"
                src={formData.image}
                className="w-24 h-24 mt-3 rounded object-cover border"
              />
            )}
          </div>

          {/* Product Description */}
          <div>
            <Label htmlFor="productDescription">Description *</Label>

            <Textarea
              id="productDescription"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Nutrition Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Nutrition</h3>

              <span className="text-xs text-muted-foreground">
                Max limit per field is 999. At least one must be {">"} 0.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Calories */}
              <Input
                type="number"
                min="0"
                max="999"
                step="any"
                placeholder="Calories (Max: 999)"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
              />

              {/* Protein */}
              <Input
                type="number"
                min="0"
                max="999"
                step="any"
                placeholder="Protein (Max: 999)"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: e.target.value })
                }
              />

              {/* Carbs */}
              <Input
                type="number"
                min="0"
                max="999"
                step="any"
                placeholder="Carbs (Max: 999)"
                value={formData.carbs}
                onChange={(e) =>
                  setFormData({ ...formData, carbs: e.target.value })
                }
              />

              {/* Fat */}
              <Input
                type="number"
                min="0"
                max="999"
                step="any"
                placeholder="Fat (Max: 999)"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({ ...formData, fat: e.target.value })
                }
              />

              {/* Fiber */}
              <Input
                type="number"
                min="0"
                max="999"
                step="any"
                placeholder="Fiber (Max: 999)"
                value={formData.fiber}
                onChange={(e) =>
                  setFormData({ ...formData, fiber: e.target.value })
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            {/* Cancel Button */}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading
                ? "Loading..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
