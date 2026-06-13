import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { toast } from "sonner";
import { createCategory } from "../../../api/adminApi";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdded,
}: AddCategoryModalProps) {
  const [form, setForm] = useState({
    name: "",
    type: "product",
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: form.name.trim(),
        type: form.type === "recipe" ? "Recipe" : "Product",
      });

      toast.success("Category added successfully");

      onAdded();
      handleClose();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to add category"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form and close modal
  const handleClose = () => {
    setForm({
      name: "",
      type: "product",
    });

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-[500px] w-[95vw] p-8 rounded-3xl bg-white border-0 shadow-2xl">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add Category
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            Create a new category for products or recipes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2 text-left">
            <Label className="text-sm font-bold text-gray-700">
              Name
            </Label>

            <Input
              placeholder="Enter category name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="h-12 bg-gray-50/50"
            />
          </div>

          <div className="space-y-2 text-left">
            <Label className="text-sm font-bold text-gray-700">
              Category Type
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "product",
                  })
                }
                className={`py-3 rounded-xl font-bold transition-all border ${
                  form.type === "product"
                    ? "bg-green-600 text-white shadow-md border-green-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Product
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "recipe",
                  })
                }
                className={`py-3 rounded-xl font-bold transition-all border ${
                  form.type === "recipe"
                    ? "bg-green-600 text-white shadow-md border-green-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Recipe
              </button>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-11 px-6 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="h-11 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}