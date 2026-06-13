import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

import { useApp } from "../../../contexts/AppContext";
import { deleteProduct } from "../../../api/productApi";
import { toast } from "sonner";
import type { Product } from "../../../contexts/AppContext";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteProductDialog({ product, open, onClose }: Props) {
  const { dispatch } = useApp();

  // Handles product deletion and updates the local state
  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id);

      dispatch({ type: "DELETE_PRODUCT", productId: product.id });

      toast.success(`${product.name} has been deleted`);
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Cannot delete this product",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      {/* Delete confirmation dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Dialog title and warning message */}
          <AlertDialogTitle>Delete Product</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete {product?.name}? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Dialog actions */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
