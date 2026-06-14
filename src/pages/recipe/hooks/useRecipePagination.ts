import { useEffect, useState } from "react";
import { getAdminRecipes, getAllRecipes } from "../../../api/recipeApi";

const RECOMMENDATION_STORAGE_KEY = "recommendedRecipeIds";

const RECIPES_PAGE_STORAGE_KEY = "recipesCurrentPage";

const AI_RECIPES_PAGE_STORAGE_KEY = "recipesAiCurrentPage";

export function useRecipePagination(aiMode: boolean = false) {
  const [currentRecipes, setCurrentRecipes] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(() => {
    const storageKey =
      sessionStorage.getItem("recipesAiMode") === "true"
        ? AI_RECIPES_PAGE_STORAGE_KEY
        : RECIPES_PAGE_STORAGE_KEY;

    const savedPage = sessionStorage.getItem(storageKey);

    return savedPage ? Number(savedPage) : 1;
  });

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  // ================= SAVE PAGE =================

  useEffect(() => {
    const storageKey = aiMode
      ? AI_RECIPES_PAGE_STORAGE_KEY
      : RECIPES_PAGE_STORAGE_KEY;

    sessionStorage.setItem(storageKey, currentPage.toString());
  }, [currentPage, aiMode]);

  // ================= LOAD RECIPES =================

  const loadRecipes = async (pageNumber: number) => {
    setLoading(true);

    try {
      // ================= AI RECOMMENDATIONS =================

      if (aiMode) {
        console.log("========== AI RECOMMENDATIONS ==========");

        const storedIds =
          pageNumber === 1
            ? []
            : JSON.parse(
                sessionStorage.getItem(RECOMMENDATION_STORAGE_KEY) || "[]",
              );

        console.log("Stored IDs:", storedIds);

        const recipes = await getAllRecipes(storedIds);

        console.log("Recommendation Response:", recipes);

        setCurrentRecipes(recipes || []);

        const newIds = (recipes || []).map((r: any) => Number(r.id));

        console.log("New IDs:", newIds);

        sessionStorage.setItem(
          RECOMMENDATION_STORAGE_KEY,
          JSON.stringify([...storedIds, ...newIds]),
        );

        const hasRecipes = (recipes?.length ?? 0) > 0;

        setHasMore(hasRecipes);

        console.log("Has More:", hasRecipes);

        console.log("Recipes Count:", recipes?.length ?? 0);

        return;
      }

      // ================= NORMAL RECIPES =================

      const response = await getAdminRecipes(pageNumber, 30);

      setCurrentRecipes(response.data || []);

      const pages = Math.ceil(response.totalCount / response.pageSize);

      setTotalPages(pages);

      setHasMore(pageNumber < pages);
    } catch (error) {
      console.error("LOAD RECIPES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE MODE CHANGE =================

  useEffect(() => {
    const storageKey = aiMode
      ? AI_RECIPES_PAGE_STORAGE_KEY
      : RECIPES_PAGE_STORAGE_KEY;

    const savedPage = sessionStorage.getItem(storageKey);

    setCurrentPage(savedPage ? Number(savedPage) : 1);
  }, [aiMode]);

  // ================= LOAD =================

  useEffect(() => {
    loadRecipes(currentPage);
  }, [currentPage, aiMode]);

  // ================= NEXT =================

  const handleNext = () => {
    if (aiMode) {
      setCurrentPage((prev) => prev + 1);
      return;
    }

    if (currentPage >= totalPages) {
      return;
    }

    setCurrentPage((prev) => prev + 1);
  };

  // ================= PREVIOUS =================

  const handlePrevious = () => {
    if (currentPage === 1) {
      return;
    }

    setCurrentPage((prev) => prev - 1);
  };

  // ================= REFRESH AI =================

  const refreshAiRecommendations = async () => {
    sessionStorage.removeItem(RECOMMENDATION_STORAGE_KEY);

    sessionStorage.setItem(AI_RECIPES_PAGE_STORAGE_KEY, "1");

    setCurrentPage(1);

    await loadRecipes(1);
  };

  return {
    currentPage,
    totalPages,
    currentRecipes,
    loading,
    hasMore,

    handleNext,
    handlePrevious,

    refreshAiRecommendations,
  };
}
