import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../../contexts/AppContext";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Product image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {/* Product name and stock status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{product.name}</h3>

          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "In Stock" : "Out"}
          </Badge>
        </div>

        {/* Product description */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Product price and category */}
        <div className="flex items-center justify-between">
          <span className="text-xl text-green-600">
            ${product.price.toFixed(2)}
          </span>

          <Badge variant="secondary">{product.category}</Badge>
        </div>

        {/* Product actions */}
        <div className="flex gap-2 mt-4">
          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>

          {/* Delete button */}
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
