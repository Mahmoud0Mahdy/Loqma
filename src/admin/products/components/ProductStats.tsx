import { Card } from "../../../components/ui/card";
import type { Product } from "../../../contexts/AppContext";
import { Package, CheckCircle2, XCircle } from "lucide-react";
import "../components/products-admin.css";

interface ProductStatsProps {
  products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  // Calculate products that are currently available
  const inStockCount = products.filter((p) => p.inStock).length;

  // Calculate products that are currently unavailable
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="prod-stats-wrapper">
      {/* Total products summary */}
      <Card className="prod-total-card">
        <div className="prod-total-icon">
          <Package size={22} />
        </div>

        <p className="prod-total-label">TOTAL PRODUCTS</p>
        <p className="prod-total-value">{products.length}</p>
      </Card>

      {/* Product stock status overview */}
      <div className="prod-mini-grid">
        {/* Products currently in stock */}
        <Card className="prod-mini-card">
          <div className="prod-mini-icon prod-mini-icon--green">
            <CheckCircle2 size={18} />
          </div>

          <p className="prod-mini-value prod-mini-value--green">
            {inStockCount}
          </p>

          <p className="prod-mini-label">IN STOCK</p>
        </Card>

        {/* Products currently out of stock */}
        <Card className="prod-mini-card">
          <div className="prod-mini-icon prod-mini-icon--red">
            <XCircle size={18} />
          </div>

          <p className="prod-mini-value prod-mini-value--red">
            {outOfStockCount}
          </p>

          <p className="prod-mini-label">OUT OF STOCK</p>
        </Card>
      </div>
    </div>
  );
}
