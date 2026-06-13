import { useNavigate } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../contexts/CheckoutContext"; // 🔥 جديد
import { useState } from "react";

export default function MiniCart({ isOpen = true, onClose }: any) {
  const { cart, updateItem, removeItem } = useCart();

  const { resetCheckout, setCheckoutData } = useCheckout();

  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const items = cart || [];

  const subtotal = items.reduce(
    (total: number, item: any) =>
      total + (item.product?.price ?? item.price ?? 0) * item.quantity,
    0,
  );

  const increaseQty = async (item: any) => {
    try {
      setLoadingId(item.product?.id || item.productId);

      await updateItem(item.cartItemId, item.quantity + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const decreaseQty = async (item: any) => {
    try {
      setLoadingId(item.product?.id || item.productId);

      if (item.quantity === 1) {
        await removeItem(item.cartItemId);

        if (items.length === 1) {
          onClose();
        }

        return;
      }

      await updateItem(item.cartItemId, item.quantity - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // checkout draft
  const handleCheckout = () => {
    resetCheckout();

    setCheckoutData({
      source: "cart",
      requestId: crypto.randomUUID(),
    });

    navigate("/checkout");

    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 w-[420px] bg-white z-[100000] flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          height: "calc(-64px + 100vh)",
          top: "64px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-lg">Your Cart ({items.length})</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((item: any) => (
            <div
              key={item.cartItemId}
              className="border rounded-lg p-3 flex gap-4"
            >
              <img
                src={item.product?.imageUrl || item.imageUrl}
                className="w-20 h-20 rounded object-cover"
              />

              <div className="flex flex-col justify-center flex-1">
                <h3 className="text-sm font-medium">
                  {item.product?.name || item.name}
                </h3>

                <span className="text-green-600 font-semibold text-base mt-1">
                  ${item.product?.price ?? item.price ?? 0}
                </span>

                <div className="flex items-center border rounded mt-2 w-fit">
                  <button
                    className="px-3 py-1"
                    onClick={() => decreaseQty(item)}
                    disabled={
                      loadingId === (item.product?.id || item.productId)
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span className="px-3 text-sm">{item.quantity}</span>

                  <button
                    className="px-3 py-1"
                    onClick={() => increaseQty(item)}
                    disabled={
                      loadingId === (item.product?.id || item.productId)
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>

            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700"
              onClick={handleCheckout}
            >
              Checkout
            </button>

            <button
              className="flex-1 bg-gray-200 py-3 rounded"
              onClick={() => {
                navigate("/cart");
                onClose();
              }}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
