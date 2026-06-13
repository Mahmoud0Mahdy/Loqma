import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";

import { CreditCard, Trash2 } from "lucide-react";

import { toast } from "sonner";

import {
  getSavedCards,
  deleteSavedCard,
  payWithSavedCard,
} from "../../../api/paymentApi";

import { useCheckout } from "../../../contexts/CheckoutContext";

export function SavedCardsStep({ setStep }: any) {
  const [cards, setCards] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<number | null>(null);

const {
  checkoutData,
  setCheckoutField,
} = useCheckout();

  const fetchCards = async () => {
    try {
      const data = await getSavedCards();

      console.log("SAVED CARDS:", data);

      setCards(data || []);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load saved cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(id);

      await deleteSavedCard(id);

      toast.success("Card deleted");

      setCards((prev) => prev.filter((card) => card.id !== id));
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete card");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUseCard = async (savedCardId: number) => {
    try {
      setActionLoading(savedCardId);

      console.log("PAY WITH SAVED CARD:", {
        orderId: checkoutData.orderId,
        savedCardId,
      });

      // pay using saved card
await payWithSavedCard(checkoutData.orderId || 0, savedCardId);

// Saved Card
setCheckoutField("usedSavedCard", true);

toast.success("Payment completed successfully");

setStep(5);
    } catch (err) {
      console.error(err);

      toast.error("Failed to use saved card");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border">
        Loading saved cards...
      </div>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Saved Cards</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NO CARDS */}
        {cards.length === 0 && (
          <div className="border rounded-xl p-6 text-center">
            <p className="text-gray-500 mb-4">No saved cards found</p>

            <Button
              onClick={() => setStep(4)}
              className="bg-green-600 hover:bg-green-700"
            >
              Use Another Card
            </Button>
          </div>
        )}

        {/* CARDS */}
        {cards.map((card: any) => (
          <div
            key={card.id}
            className="border rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="text-green-600" size={20} />
              </div>

              <div>
                {/* LAST 4 */}
                <h3 className="font-semibold">
                  {card.brand} •••• {card.last4Digits}
                </h3>

                {/* EXPIRY */}
                <p className="text-sm text-gray-500">
                  Expires {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleUseCard(card.id)}
                disabled={actionLoading === card.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading === card.id ? "Processing..." : "Use"}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleDelete(card.id)}
                disabled={actionLoading === card.id}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}

        {/* USE ANOTHER */}
        {cards.length > 0 && (
          <button
            onClick={() => setStep(4)}
            className="text-green-600 hover:underline text-sm font-medium"
          >
            Use Another Card
          </button>
        )}
      </CardContent>
    </Card>
  );
}
