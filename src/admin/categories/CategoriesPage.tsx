 import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  Plus,
  LayoutGrid,
  ChefHat,
  Package,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import { getCategories, deleteCategory } from "../../api/adminApi";
import AddCategoryModal from "./components/AddCategoryModal";
import { CategoryStats } from "./components/CategoryStats";
import "../categories/components/Categories-admin.css";

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  // Load categories from API
  const fetchData = async () => {
    try {
      setLoading(true);

      const recipe = await getCategories("Recipe");
      const product = await getCategories("Product");

      const data = [
        ...recipe.map((c: any) => ({
          ...c,
          type: "Recipe",
        })),
        ...product.map((c: any) => ({
          ...c,
          type: "Product",
        })),
      ];

      setCategories(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply search and type filters
  useEffect(() => {
    let data = [...categories];

    if (filterType !== "all") {
      data = data.filter((c) =>
        filterType === "recipe"
          ? c.type === "Recipe"
          : c.type === "Product"
      );
    }

    if (search) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, filterType, categories]);

  const handleDeleteCategory = async (
    categoryId: number
  ) => {
    try {
      await deleteCategory(categoryId);

      setCategories((prev) =>
        prev.filter(
          (c) => c.id !== categoryId
        )
      );

      setFiltered((prev) =>
        prev.filter(
          (c) => c.id !== categoryId
        )
      );

      toast.success(
        "Category deleted successfully"
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-gray-600">
            Manage products and recipes categories
          </p>
        </div>

        <Button
          onClick={() => setOpenModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and filtering controls */}
      <Card className="p-4 shadow-sm border-gray-100 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <Input
              placeholder="Search categories..."
              className="pl-10 w-full"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {["all", "product", "recipe"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilterType(type)
                  }
                  className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-colors ${
                    filterType === type
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Categories overview */}
      <CategoryStats categories={categories} />

      {/* Categories table */}
      {loading ? (
        <Card className="p-12 text-center text-gray-500 border-gray-100">
          <p>Loading categories...</p>
        </Card>
      ) : filtered.length > 0 ? (
        <div className="ca-table-wrap">
          <div style={{ overflowX: "auto" }}>
            <table className="ca-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>
                    ID
                  </th>
                  <th style={{ width: "50%" }}>
                    Category Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      width: "20%",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      width: "20%",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="ca-id">
                      #
                      {String(c.id).padStart(
                        4,
                        "0"
                      )}
                    </td>

                    <td>
                      <div className="ca-name-cell">
                        <div
                          className={`ca-name-icon ${
                            c.type === "Recipe"
                              ? "ca-name-icon--recipe"
                              : "ca-name-icon--product"
                          }`}
                        >
                          {c.type ===
                          "Recipe" ? (
                            <ChefHat
                              size={18}
                            />
                          ) : (
                            <Package
                              size={18}
                            />
                          )}
                        </div>

                        <span className="ca-name-text">
                          {c.name}
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <Badge
                        variant="outline"
                        className={
                          c.type ===
                          "Recipe"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {c.type ===
                        "Recipe"
                          ? "Recipe"
                          : "Product"}
                      </Badge>
                    </td>

                    <td
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2
                              size={18}
                            />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Category
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              Are you sure
                              you want to
                              delete the
                              category "
                              {c.name}"?
                              This action
                              cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteCategory(
                                  c.id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center text-gray-500 border-gray-100">
          <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>
            No categories found
            matching your search.
          </p>
        </Card>
      )}

      <AddCategoryModal
        isOpen={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onAdded={fetchData}
      />
    </div>
  );
}