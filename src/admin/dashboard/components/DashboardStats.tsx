import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Users, Package, UtensilsCrossed, MessageSquare } from "lucide-react";
import { getRecipeDifficultyStats } from "../../../api/recipeApi";

export function DashboardStats({ usersCount, counts, loading }: any) {
  const [totalRecipes, setTotalRecipes] = useState(0);

  useEffect(() => {
    const loadRecipeStats = async () => {
      try {
        const data = await getRecipeDifficultyStats();

        setTotalRecipes(data.totalRecipes || 0);
      } catch (error) {
        console.error("Failed to load recipe stats:", error);
      }
    };

    loadRecipeStats();
  }, [counts?.recipes]);

  const stats = [
    {
      title: "Total Users",
      value: Number(usersCount || 0).toLocaleString(),
      icon: Users,
      colorClass: "da-icon--blue",
    },
    {
      title: "Total Products",
      value: Number(counts?.products || 0).toLocaleString(),
      icon: Package,
      colorClass: "da-icon--green",
    },
    {
      title: "Total Recipes",
      value: totalRecipes.toLocaleString(),
      icon: UtensilsCrossed,
      colorClass: "da-icon--orange",
    },
    {
      title: "Community Posts",
      value: Number(counts?.posts || 0).toLocaleString(),
      icon: MessageSquare,
      colorClass: "da-icon--purple",
    },
  ];

  return (
    <div className="da-stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="da-stat-card">
            {loading ? (
              <div className="animate-pulse flex flex-col items-center gap-3 w-full">
                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                <div className="h-8 w-16 bg-gray-100 rounded"></div>
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
              </div>
            ) : (
              <>
                <div className={`da-stat-icon ${stat.colorClass}`}>
                  <Icon size={22} />
                </div>

                <p className="da-stat-value">{stat.value}</p>

                <p className="da-stat-title">{stat.title}</p>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
