import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { CreditCard } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

interface Props {
  promoCode: string;
  setPromoCode: (v: string) => void;
  proceedToCheckout?: () => void;
}

export const OrderSummary = memo(function OrderSummary({
  promoCode,
  setPromoCode,
  proceedToCheckout,
}: Props) {
  const { cartSummary } = useCart();
  const navigate = useNavigate(); 

  const s = Number(cartSummary?.subtotal) || 0;
  const t = Number(cartSummary?.tax) || 0;
  const sh = Number(cartSummary?.shipping) || 0;
  const tot = Number(cartSummary?.total) || 0;

  const handleCheckout = () => {
    if (proceedToCheckout) {
      proceedToCheckout();
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Card className="border-0 shadow-md sticky top-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${s.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${t.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{sh === 0 ? "Free" : `$${sh.toFixed(2)}`}</span>
          </div>

          {sh > 0 && (
            <p className="text-sm text-gray-500">
              Free shipping on orders over $100
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold my-4">
          <span>Total</span>
          <span>${tot.toFixed(2)}</span>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CreditCard className="mr-2" size={18} />
          Proceed to Checkout
        </Button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Secure checkout powered by SSL encryption
        </p>
      </CardContent>
    </Card>
  );
});
