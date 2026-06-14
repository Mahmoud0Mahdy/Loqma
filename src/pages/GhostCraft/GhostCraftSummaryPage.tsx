import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2, ShoppingCart, Sparkles } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner@2.0.3";

import { GhostCraftOrder } from "../../api/ghostCraftApi";
import { useCart } from "../../contexts/CartContext";

export function GhostCraftSummaryPage() {
  const navigate = useNavigate();

  const { addGhostCraftToCart } = useCart();

  const { state } = useLocation();

  const order = (state?.order || null) as GhostCraftOrder | null;

  const hasRedirectedRef = useRef(false);

  // ================= NORMALIZE =================

  const normalizedOrder = useMemo(() => {
    if (!order) return null;

    return {
      id: order.id,

      dishDescription: order.dishDescription || "",

      allergies: Array.isArray(order.allergies) ? order.allergies : [],

      dietaryPreferences: Array.isArray(order.dietaryPreferences)
        ? order.dietaryPreferences
        : [],

      spicinessLevel: order.spicinessLevel ?? 0,

      saltinessLevel: order.saltinessLevel ?? 0,

      portionSize: order.portionSize || "",

      specialInstructions: order.specialInstructions || "",

      price: Number(order.price ?? 0),
    };
  }, [order]);

  // ================= REDIRECT =================

  useEffect(() => {
    if (!normalizedOrder && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;

      toast.error("No order found. Please create your order first.");

      navigate("/ghostcraft", {
        replace: true,
      });
    }
  }, [normalizedOrder, navigate]);

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    if (!normalizedOrder) {
      toast.error("Order data not found");

      navigate("/ghostcraft");

      return;
    }

    try {
      await addGhostCraftToCart(Number(normalizedOrder.id));

      toast.success("Ghost Craft order added to cart!");

      navigate("/cart");
    } catch (error) {
      console.error(error);

      toast.error("Failed to add order to cart");
    }
  };

  // ================= EMPTY =================

  if (!normalizedOrder) {
    return null;
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
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
          {/* SUMMARY */}
          <Card className="p-6 border-2 border-green-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate("/ghostcraft", {
                    state: {
                      order,
                      isEditing: true,
                    },
                  })
                }
                className="text-green-600 hover:text-green-700"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              {/* FOOD */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Food Order</div>

                <div className="text-gray-900">
                  {normalizedOrder.dishDescription}
                </div>
              </div>

              {/* ALLERGIES */}
              {normalizedOrder.allergies.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Allergies to Avoid
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {normalizedOrder.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DIET */}
              {normalizedOrder.dietaryPreferences.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Dietary Preferences
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {normalizedOrder.dietaryPreferences.map((diet) => (
                      <span
                        key={diet}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* LEVELS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Spice Level</div>

                  <div className="text-gray-900">
                    {normalizedOrder.spicinessLevel}/5
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Salt Level</div>

                  <div className="text-gray-900">
                    {normalizedOrder.saltinessLevel}/5
                  </div>
                </div>
              </div>

              {/* PORTION */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Portion Size</div>

                <div className="text-gray-900">
                  {normalizedOrder.portionSize}
                </div>
              </div>

              {/* NOTES */}
              {normalizedOrder.specialInstructions && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Special Instructions
                  </div>

                  <div className="text-gray-900">
                    {normalizedOrder.specialInstructions}
                  </div>
                </div>
              )}

              {/* PRICE */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Total Price</span>

                  <span className="text-green-600">
                    ${normalizedOrder.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full h-12"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
