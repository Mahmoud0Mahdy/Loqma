import { memo, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveConfirmModal = memo(function RemoveConfirmModal({
  open,
  onConfirm,
  onCancel,
}: Props) {

  // onCancel
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  // ESC handler + lock scroll
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancelRef.current();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        className="relative bg-white rounded-xl p-6 w-[350px] shadow-xl animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          Remove Item
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to remove this item from your cart?
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Remove
          </Button>

        </div>
      </div>
    </div>
  );
});