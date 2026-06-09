import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { FilterState } from "../types";

interface Props {
  filters: FilterState;
  updateFilter: (
    key: keyof FilterState,
    value: string
  ) => void;
  resultsCount: number;

  aiMode: boolean;
  onAiModeChange: (
    checked: boolean
  ) => void;
}

export function RecipesFilters({
  filters,
  updateFilter,
  resultsCount,
  aiMode,
  onAiModeChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <Input
            placeholder="Search recipes..."
            value={filters.searchTerm}
            onChange={(e) =>
              updateFilter(
                "searchTerm",
                e.target.value
              )
            }
            className="pl-10"
          />
        </div>

        {/* Same for Category, Difficulty, and Sort selects using updateFilter('key', val) */}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm font-medium text-gray-500">
          {resultsCount} recipes found
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={aiMode}
            onChange={(e) =>
              onAiModeChange(
                e.target.checked
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm font-medium text-gray-700">
            AI Recommendations
          </span>
        </label>
      </div>
    </div>
  );
}