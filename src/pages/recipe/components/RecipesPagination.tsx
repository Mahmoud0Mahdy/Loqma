import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../../contexts/AppContext";

interface RecipesPaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  hasMore?: boolean;
  aiMode?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function RecipesPagination({
  currentPage,
  totalPages,
  loading,
  hasMore = true,
  aiMode = false,
  onNext,
  onPrevious,
}: RecipesPaginationProps) {
  const { state } = useApp();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!state.isAuthenticated && currentPage === 1) {
      toast.error("Please login first to browse more recipes");

      navigate("/login");

      return;
    }

    onNext();
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer"
      >
        ← Previous
      </button>

      <span className="font-medium">
        {aiMode
          ? `Page ${currentPage}`
          : `Page ${currentPage} of ${totalPages}`}
      </span>

      <button
        onClick={handleNext}
        disabled={loading || (aiMode ? !hasMore : currentPage >= totalPages)}
        className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Loading..." : "Next →"}
      </button>
    </div>
  );
}
