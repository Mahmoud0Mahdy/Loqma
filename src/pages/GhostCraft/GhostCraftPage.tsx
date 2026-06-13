import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChefHat, Sparkles, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { toast } from "sonner@2.0.3";
import {
  createGhostCraftOrder,
  updateGhostCraftOrder,
} from "../../api/ghostCraftApi";

const MAX_SPECIAL_INSTRUCTIONS_LENGTH = 300;
const MAX_FOOD_LENGTH = 200;
export function GhostCraftPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingOrder = location.state?.order || null;
  const isEditing = location.state?.isEditing || false;

  // Food description
  const [foodName, setFoodName] = useState("");

  // Preferences
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [spiciness, setSpiciness] = useState(3);
  const [saltiness, setSaltiness] = useState(3);
  const [portionSize, setPortionSize] = useState("medium");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Available options
  const allergyOptions = [
    "Dairy",
    "Eggs",
    "Fish",
    "Shellfish",
    "Tree Nuts",
    "Peanuts",
    "Wheat",
    "Soy",
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "High-Protein",
  ];

  const portionOptions = [
    { value: "small", label: "Small (1-2 servings)", price: 12.99 },
    { value: "medium", label: "Medium (3-4 servings)", price: 18.99 },
    { value: "large", label: "Large (5-6 servings)", price: 24.99 },
    { value: "family", label: "Family (7-8 servings)", price: 32.99 },
  ];

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy],
    );
  };

  const toggleDietary = (diet: string) => {
    setDietary((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet],
    );
  };

  const normalizePortionSize = (
    value: string,
  ): "Small" | "Medium" | "Large" | "Family" => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "small") return "Small";
    if (normalized === "large") return "Large";
    if (normalized === "family") return "Family";
    return "Medium";
  };

  useEffect(() => {
    if (isEditing && editingOrder) {
      setFoodName(editingOrder.dishDescription || "");
      setAllergies(editingOrder.allergies || []);
      setDietary(editingOrder.dietaryPreferences || []);
      setSpiciness(editingOrder.spicinessLevel || 3);
      setSaltiness(editingOrder.saltinessLevel || 3);

      setPortionSize(editingOrder.portionSize?.toLowerCase() || "medium");

      setSpecialInstructions(editingOrder.specialInstructions || "");
    }
  }, [isEditing, editingOrder]);

  const handlePreviewOrder = async () => {
    if (!foodName.trim()) {
      toast.error("Please enter what food you want to order");
      return;
    }

    if (foodName.trim().length < 5) {
      toast.error("Food description must be at least 5 characters");
      return;
    }
    if (specialInstructions.trim() && specialInstructions.trim().length < 3) {
      toast.error("Special instructions must be at least 3 characters");
      return;
    }

    const payload = {
      dishDescription: foodName,
      allergies,
      dietaryPreferences: dietary,
      spicinessLevel: spiciness,
      saltinessLevel: saltiness,
      portionSize: normalizePortionSize(portionSize),
      specialInstructions,
    };

    try {
      let order;

      if (isEditing && editingOrder?.id) {
        order = await updateGhostCraftOrder(editingOrder.id, payload);
      } else {
        order = await createGhostCraftOrder(payload);
      }

      const normalizedOrder = order?.data ?? order;

      navigate("/ghostcraft-summary", {
        state: { order: normalizedOrder },
      });

      toast.success(
        isEditing
          ? "Order updated successfully!"
          : "Order preview generated successfully!",
      );
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update order" : "Failed to create order",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-gray-900 mb-2">Ghost Craft</h1>
          <p className="text-gray-600">
            Order your perfect custom meal. Tell us what you want and customize
            every detail.
          </p>
        </div>

        <div className="space-y-6">
          {/* Food Description */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="text-green-600" size={24} />

              <div className="flex justify-between items-center w-full">
                <h2 className="text-gray-900">What would you like to order?</h2>

                <span
                  className={`text-xs ${
                    foodName.length >= MAX_FOOD_LENGTH
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {foodName.length}/{MAX_FOOD_LENGTH}
                </span>
              </div>
            </div>
            <Input
              placeholder="e.g., Grilled salmon with roasted vegetables, Chicken tikka masala..."
              value={foodName}
              maxLength={MAX_FOOD_LENGTH}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full"
            />
          </Card>

          {/* Allergies */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Allergies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allergyOptions.map((allergy) => (
                <label
                  key={allergy}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={allergies.includes(allergy)}
                    onCheckedChange={() => toggleAllergy(allergy)}
                  />
                  <span className="text-sm text-gray-700">{allergy}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Dietary Restrictions */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Dietary Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dietaryOptions.map((diet) => (
                <label
                  key={diet}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={dietary.includes(diet)}
                    onCheckedChange={() => toggleDietary(diet)}
                  />
                  <span className="text-sm text-gray-700">{diet}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Spice & Salt Levels */}
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Spiciness Level</Label>
                  <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                    {spiciness}/5
                  </span>
                </div>
                <Slider
                  value={[spiciness]}
                  onValueChange={(value) => setSpiciness(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Mild</span>
                  <span className="text-xs text-gray-500">Hot</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Saltiness Level</Label>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {saltiness}/5
                  </span>
                </div>
                <Slider
                  value={[saltiness]}
                  onValueChange={(value) => setSaltiness(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Low</span>
                  <span className="text-xs text-gray-500">High</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Portion Size */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Portion Size</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {portionOptions.map((portion) => (
                <button
                  key={portion.value}
                  onClick={() => setPortionSize(portion.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    portionSize === portion.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900">{portion.label}</div>
                      <div className="text-sm text-gray-600">
                        ${portion.price.toFixed(2)}
                      </div>
                    </div>
                    {portionSize === portion.value && (
                      <Check className="text-green-600" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Special Instructions */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Special Instructions</h3>

              <span
                className={`text-xs ${
                  specialInstructions.length >= MAX_SPECIAL_INSTRUCTIONS_LENGTH
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {specialInstructions.length}/{MAX_SPECIAL_INSTRUCTIONS_LENGTH}
              </span>
            </div>

            <Textarea
              placeholder="Any additional notes or special requests..."
              value={specialInstructions}
              maxLength={MAX_SPECIAL_INSTRUCTIONS_LENGTH}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full min-h-24"
            />
          </Card>

          {/* Preview Button */}
          <div className="flex gap-3">
            <Button
              onClick={handlePreviewOrder}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full h-12"
            >
              Preview Order
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-orange-50 border-orange-200">
          <h3 className="text-gray-900 mb-2">How Ghost Craft Works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Describe the dish you want in your own words</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Customize all preferences using simple controls</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Review your custom order before adding to cart</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>Our chefs will prepare your meal exactly as specified</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
