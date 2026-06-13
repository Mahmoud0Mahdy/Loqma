import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import type { Recipe } from "../../../contexts/AppContext";
import {
  UtensilsCrossed,
  ChefHat,
  Activity,
  Flame,
  TrendingUp,
  Zap,
  Award,
} from "lucide-react";
import { getRecipeDifficultyStats } from "../../../api/recipeApi";
import "../components/recipes-admin.css";

interface RecipeStatsProps {
  recipes: Recipe[];
}

interface DifficultyStats {
  totalRecipes: number;
  easy: number;
  medium: number;
  hard: number;
  intermediate: number;
  advanced: number;
  expert: number;
}

export function RecipeStats({ recipes }: RecipeStatsProps) {
  const [stats, setStats] = useState<DifficultyStats>({
    totalRecipes: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    intermediate: 0,
    advanced: 0,
    expert: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getRecipeDifficultyStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load recipe stats:", error);
      }
    };

    loadStats();
  }, [recipes]);

  return (
    <div className="rs-stats-wrapper">
      {/* Total recipes */}
      <Card className="rs-total-card">
        <div className="rs-total-icon">
          <UtensilsCrossed size={22} />
        </div>

        <p className="rs-total-label">TOTAL RECIPES</p>

        <p className="rs-total-value">{stats.totalRecipes.toLocaleString()}</p>
      </Card>

      {/* Recipe difficulty statistics */}
      <div className="rs-mini-grid">
        {/* Easy */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--green">
            <ChefHat size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--green">
            {stats.easy.toLocaleString()}
          </p>

          <p className="rs-mini-label">EASY</p>
        </Card>

        {/* Intermediate */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--blue">
            <TrendingUp size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--blue">
            {stats.intermediate.toLocaleString()}
          </p>

          <p className="rs-mini-label">INTERMEDIATE</p>
        </Card>

        {/* Medium */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--orange">
            <Activity size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--orange">
            {stats.medium.toLocaleString()}
          </p>

          <p className="rs-mini-label">MEDIUM</p>
        </Card>

        {/* Advanced */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--indigo">
            <Zap size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--indigo">
            {stats.advanced.toLocaleString()}
          </p>

          <p className="rs-mini-label">ADVANCED</p>
        </Card>

        {/* Hard */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--red">
            <Flame size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--red">
            {stats.hard.toLocaleString()}
          </p>

          <p className="rs-mini-label">HARD</p>
        </Card>

        {/* Expert */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--purple">
            <Award size={18} />
          </div>

          <p className="rs-mini-value rs-mini-value--purple">
            {stats.expert.toLocaleString()}
          </p>

          <p className="rs-mini-label">EXPERT</p>
        </Card>
      </div>
    </div>
  );
}
