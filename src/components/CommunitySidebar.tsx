import {
  Plus,
  ChefHat,
  Lightbulb,
  Star,
  MessageSquare,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface CommunitySidebarProps {
  onCreatePost: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CommunitySidebar({
  onCreatePost,
  selectedCategory,
  onCategorySelect,
}: CommunitySidebarProps) {
  const navigate = useNavigate();

  const categories = [
    {
      id: "all",
      name: "All Posts",
      icon: null,
      color: "text-gray-600",
    },
    {
      id: "recipes",
      name: "Recipes",
      icon: ChefHat,
      color: "text-green-600",
    },
    {
      id: "tips",
      name: "Kitchen Tips",
      icon: Lightbulb,
      color: "text-yellow-600",
    },
    {
      id: "reviews",
      name: "Product Reviews",
      icon: Star,
      color: "text-orange-600",
    },
    {
      id: "questions",
      name: "Quick Questions",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      id: "budget",
      name: "Budget Meals",
      icon: DollarSign,
      color: "text-blue-600",
    },
  ];

  return (
    <aside className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <Button
          onClick={onCreatePost}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
        >
          <Plus size={20} />
          Create Post
        </Button>
      </div>

      {/* My Posts */}
      <div
        onClick={() => navigate("/my-posts")}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:border-green-500 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <FileText size={20} className="text-green-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              My Posts
            </h3>

            <p className="text-sm text-gray-500">
              View and manage your posts
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="mb-4 text-gray-900">Categories</h3>

        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {Icon && (
                  <Icon
                    size={18}
                    className={category.color}
                  />
                )}

                {!Icon && <div className="w-[18px]" />}

                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl shadow-sm border border-orange-100 p-4">
        <h3 className="mb-2 text-gray-900">
          Community Guidelines
        </h3>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Be respectful and kind</span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Share helpful tips and recipes</span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Keep it food-related</span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>No spam or self-promotion</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}