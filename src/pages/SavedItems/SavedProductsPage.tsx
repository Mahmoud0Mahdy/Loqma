import { Navigate, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { toggleProductFavorite, getFavoriteProducts } from "../../api/favoriteApi";
import { useEffect, useState } from "react";

export function SavedProductsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchFavorites();
    }
  }, [state.isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const data = await getFavoriteProducts();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleProduct = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const isSaved = favorites.some((p) => String(p.productId) === productId);

    try {
      await toggleProductFavorite(productId);

      toast.success(
        isSaved
          ? "Product removed from favorites"
          : "Product saved to favorites"
      );

      fetchFavorites();

    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              Saved Products ({favorites.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((product) => {
                  const productId = String(product.productId);

                  return (
                    <Card
                      key={product.productId}
                      className="group cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                      onClick={() => navigate(`/product/${product.productId}`)}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                          <ImageWithFallback
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />

                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/90 p-1 h-8 w-8"
                            onClick={(e) => toggleProduct(productId, e)}
                          >
                            <Heart
                              size={16}
                              className="fill-red-500 text-red-500"
                            />
                          </Button>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {product.categoryName}
                            </Badge>

                            <span className="font-semibold text-green-600">
                              ${product.price}
                            </span>
                          </div>

                          <h3 className="font-semibold text-gray-900">
                            {product.productName}
                          </h3>

                          <Button size="sm" variant="outline" className="w-full">
                            <ShoppingCart size={16} className="mr-2" />
                            View Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No saved products yet</p>
                <Button onClick={() => navigate("/shop")} className="mt-4">
                  Browse Products
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}