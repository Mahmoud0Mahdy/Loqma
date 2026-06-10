import { Card } from "../../../components/ui/card";
import type { Recipe } from "../../../contexts/AppContext";
import { UtensilsCrossed, ChefHat, Activity, Flame } from "lucide-react";
import "../components/recipes-admin.css";

interface RecipeStatsProps {
  recipes: Recipe[];
}

export function RecipeStats({ recipes }: RecipeStatsProps) {
  const getDiff = (r: any) =>
    (r.difficultyLevel || r.difficulty || "").toLowerCase().trim();

  const total = recipes?.length || 0;

  const easy =
    recipes?.filter((r) => getDiff(r) === "easy").length || 0;

  const intermediate =
    recipes?.filter((r) => getDiff(r) === "intermediate").length || 0;

  const medium =
    recipes?.filter((r) => getDiff(r) === "medium").length || 0;

  const advanced =
    recipes?.filter((r) => getDiff(r) === "advanced").length || 0;

  const hard =
    recipes?.filter((r) => getDiff(r) === "hard").length || 0;

  const expert =
    recipes?.filter((r) => getDiff(r) === "expert").length || 0;

  return (
    <div className="rs-stats-wrapper">
      {/* Top Card */}
      <Card className="rs-total-card">
        <div className="rs-total-icon">
          <UtensilsCrossed size={22} />
        </div>

        <p className="rs-total-label">TOTAL RECIPES</p>
        <p className="rs-total-value">{total}</p>
      </Card>

      {/* Difficulty Cards */}
      <div className="rs-mini-grid">
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--green">
            <ChefHat size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--green">{easy}</p>
          <p className="rs-mini-label">EASY</p>
        </Card>

        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--orange">
            <Activity size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--orange">{medium}</p>
          <p className="rs-mini-label">MEDIUM</p>
        </Card>

        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--red">
            <Flame size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--red">{hard}</p>
          <p className="rs-mini-label">HARD</p>
        </Card>
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <p className="text-gray-600 text-sm mb-1">Intermediate</p>
          <p className="text-2xl text-pink-600 font-bold">{intermediate}</p>
        </Card>

        <Card className="p-4">
          <p className="text-gray-600 text-sm mb-1">Advanced</p>
          <p className="text-2xl text-indigo-600 font-bold">{advanced}</p>
        </Card>

        <Card className="p-4">
          <p className="text-gray-600 text-sm mb-1">Expert</p>
          <p className="text-2xl text-purple-600 font-bold">{expert}</p>
        </Card>
      </div>
    </div>
  );
}