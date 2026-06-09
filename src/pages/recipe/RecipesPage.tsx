import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecipes } from "./hooks/useRecipes";
import { useRecipePagination } from "./hooks/useRecipePagination";

import { RecipesHeader } from "./components/RecipesHeader";
import { RecipesFilters } from "./components/RecipesFilters";
import { RecipesGrid } from "./components/RecipesGrid";
import { RecipesPagination } from "./components/RecipesPagination";
import { EmptyState } from "./components/EmptyState";
import { QuickActions } from "./components/QuickActions";

export function RecipesPage() {
  const navigate = useNavigate();

  const [aiMode, setAiMode] =
    useState(false);

  const {
    currentPage,
    totalPages,
    currentRecipes,
    loading,
    hasMore,
    handleNext,
    handlePrevious,
  } = useRecipePagination(aiMode);

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredRecipes,
  } = useRecipes(currentRecipes);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipesHeader />

        <RecipesFilters
          filters={filters}
          updateFilter={updateFilter}
          resultsCount={filteredRecipes.length}
          aiMode={aiMode}
          onAiModeChange={setAiMode}
        />

        {filteredRecipes.length > 0 ? (
          <RecipesGrid
            recipes={filteredRecipes}
            onRecipeClick={(id) =>
              navigate(`/recipe/${id}`)
            }
          />
        ) : (
          <EmptyState
            onClear={clearFilters}
          />
        )}

        <RecipesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          hasMore={hasMore}
          aiMode={aiMode}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        <QuickActions
          onNavigate={() =>
            navigate("/chatbot")
          }
        />
      </div>
    </div>
  );
}