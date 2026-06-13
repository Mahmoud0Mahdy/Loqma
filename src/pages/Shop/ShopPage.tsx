import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useApp } from "../../contexts/AppContext";
import { Search, Grid, List } from "lucide-react";
import { getAllProducts } from "../../api/productApi";
import { getCategories } from "../../api/adminApi";

export function ShopPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const { state, dispatch } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        dispatch({ type: "SET_PRODUCTS", products: data });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(2);
        const names = data.map((c: any) => c.name.toLowerCase());
        setCategories(["all", ...names]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = state.products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (product.categoryName || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);

        case "price-high":
          return (b.price || 0) - (a.price || 0);

        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return filtered;
  }, [state.products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop Fresh Products
          </h1>
          <p className="text-gray-500">
            Discover our wide selection of fresh, high-quality products
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price Low</SelectItem>
                <SelectItem value="price-high">Price High</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <Grid size={16} />
              </Button>

              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {filteredProducts.length} products found
          </div>
        </div>

        {/* Products */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className={`cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition ${
                viewMode === "list"
                  ? "flex items-center justify-between p-4"
                  : "p-3"
              }`}
            >
              <CardContent className="p-0 w-full">
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-square overflow-hidden rounded-lg relative">
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-sm">{product.name}</h3>

                      <span className="text-xs text-gray-400">
                        {product.categoryName}
                      </span>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-green-600 font-semibold text-sm">
                          ${product.price}
                        </p>

                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm rounded-md"
                          disabled={!product.inStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 w-full">
                      {/* Image */}
                      <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                          {product.description}
                        </p>

                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                          {product.categoryName}
                        </span>

                        <p className="text-green-600 font-semibold mt-2">
                          ${product.price}
                        </p>
                      </div>

                      {/* Button */}
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-6"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
