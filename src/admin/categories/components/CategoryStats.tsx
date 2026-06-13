import { Card } from '../../../components/ui/card';
import { LayoutGrid, Package, ChefHat } from "lucide-react";
import "../../categories/components/Categories-admin.css";

interface CategoryStatsProps {
  categories: any[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const productsCount = categories.filter(c => c.type === "Product").length;
  const recipesCount = categories.filter(c => c.type === "Recipe").length;

  return (
    <div className="ca-stats-wrapper">

      {/* Categories overview */}
      <Card className="ca-total-card">
        <div className="ca-total-icon">
          <LayoutGrid size={22} />
        </div>
        <p className="ca-total-label">TOTAL CATEGORIES</p>
        <p className="ca-total-value">{categories.length}</p>
      </Card>

      {/* Category breakdown */}
      <div className="ca-mini-grid">

        <Card className="ca-mini-card">
          <div className="ca-mini-icon ca-mini-icon--blue">
            <Package size={18} />
          </div>
          <p className="ca-mini-value ca-mini-value--blue">{productsCount}</p>
          <p className="ca-mini-label">PRODUCTS</p>
        </Card>

        <Card className="ca-mini-card">
          <div className="ca-mini-icon ca-mini-icon--green">
            <ChefHat size={18} />
          </div>
          <p className="ca-mini-value ca-mini-value--green">{recipesCount}</p>
          <p className="ca-mini-label">RECIPES</p>
        </Card>

      </div>
    </div>
  );
}