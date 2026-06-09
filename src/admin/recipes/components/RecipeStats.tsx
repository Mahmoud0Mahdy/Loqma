<<<<<<< Updated upstream
import { Card } from '../../../components/ui/card';
import type { Recipe } from '../../../contexts/AppContext';
import { UtensilsCrossed, ChefHat, Activity, Flame } from "lucide-react";
// تأكد من مسار ملف الـ CSS على حسب مكان ما حفظته
import "../components/recipes-admin.css"; 
=======
import { Card } from "../../../components/ui/card";
import type { Recipe } from "../../../contexts/AppContext";
>>>>>>> Stashed changes

interface RecipeStatsProps {
  recipes: Recipe[];
}

export function RecipeStats({ recipes }: RecipeStatsProps) {
<<<<<<< Updated upstream

  // 🔥 دالة عشان تقرا مستوى الصعوبة صح
  const getDiff = (r: any) => (r.difficultyLevel || r.difficulty || '').toLowerCase().trim();

  const total = recipes?.length || 0;
  const easy = recipes?.filter(r => getDiff(r) === 'easy').length || 0;
  const medium = recipes?.filter(r => getDiff(r) === 'medium').length || 0;
  const hard = recipes?.filter(r => getDiff(r) === 'hard').length || 0;

  return (
    <div className="rs-stats-wrapper">
      
      {/* ── Top: Total Recipes ── */}
      <Card className="rs-total-card">
        <div className="rs-total-icon">
          <UtensilsCrossed size={22} />
        </div>
        <p className="rs-total-label">TOTAL RECIPES</p>
        <p className="rs-total-value">{total}</p>
=======
  const total = recipes?.length || 0;

  const easy = recipes?.filter((r) => r.difficulty === "Easy").length || 0;

  const intermediate =
    recipes?.filter((r) => r.difficulty === "Intermediate").length || 0;

  const medium = recipes?.filter((r) => r.difficulty === "Medium").length || 0;

  const advanced =
    recipes?.filter((r) => r.difficulty === "Advanced").length || 0;

  const hard = recipes?.filter((r) => r.difficulty === "Hard").length || 0;

  const expert =
    recipes?.filter((r) => r.difficulty === "Expert").length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Total Recipes</p>
        <p className="text-2xl font-bold">{total}</p>
>>>>>>> Stashed changes
      </Card>

      {/* ── Bottom: 3 Difficulties ── */}
      <div className="rs-mini-grid">
        
        {/* Easy */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--green">
            <ChefHat size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--green">{easy}</p>
          <p className="rs-mini-label">EASY</p>
        </Card>

<<<<<<< Updated upstream
        {/* Medium */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--orange">
            <Activity size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--orange">{medium}</p>
          <p className="rs-mini-label">MEDIUM</p>
        </Card>

        {/* Hard */}
        <Card className="rs-mini-card">
          <div className="rs-mini-icon rs-mini-icon--red">
            <Flame size={18} />
          </div>
          <p className="rs-mini-value rs-mini-value--red">{hard}</p>
          <p className="rs-mini-label">HARD</p>
        </Card>

      </div>
=======
      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Intermediate</p>
        <p className="text-2xl text-pink-600 font-bold">{intermediate}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Medium</p>
        <p className="text-2xl text-orange-600 font-bold">{medium}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Advanced</p>
        <p className="text-2xl text-indigo-600 font-bold">{advanced}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Hard</p>
        <p className="text-2xl text-red-600 font-bold">{hard}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm mb-1">Expert</p>
        <p className="text-2xl text-purple-600 font-bold">{expert}</p>
      </Card>
>>>>>>> Stashed changes
    </div>
  );
}