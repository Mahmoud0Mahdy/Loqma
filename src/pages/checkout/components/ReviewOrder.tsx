import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";

import { useCheckout } from "../../../contexts/CheckoutContext";

export function ReviewOrder({
  formData,
  cart,
  placeOrder,
  placingOrder,
}: any) {
  const { checkoutData } = useCheckout();

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* SHIPPING */}
        <div>
          <h3 className="font-semibold mb-2">Shipping Address</h3>

          <p className="text-gray-600 leading-7">
            {formData.fullName}
            <br />
            {formData.address}
            <br />
            {formData.city}, {formData.state} {formData.zipCode}
          </p>
        </div>

        {/* PAYMENT */}
        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>

          {checkoutData.paymentMethodId === 2 ? (
            <div className="text-gray-600">
              Cash On Delivery
            </div>
          ) : checkoutData.usedSavedCard ? (
            <div className="text-gray-600">
              Saved Card
            </div>
          ) : (
            <div className="text-gray-600">
              **** **** **** {formData.cardNumber?.slice(-4)}
            </div>
          )}
        </div>

        {/* ITEMS */}
        <div>
          <h3 className="font-semibold mb-3">Order Items</h3>

          <div className="space-y-3">
            {(cart || []).map((item: any) => {
              const isGhostCraft = !!item.ghostCraftOrderId;

              const productName =
                item.product?.name ||
                item.name ||
                (isGhostCraft
                  ? "Ghost Craft Meal"
                  : "Unknown Product");

              const productPrice = Number(
                item.product?.price ?? item.price ?? 0
              );

              const itemKey =
                item.product?.id ||
                item.productId ||
                item.cartItemId;

              return (
                <div
                  key={itemKey}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    {isGhostCraft && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold mb-2">
                        Ghost Craft
                      </div>
                    )}

                    <p className="font-medium text-gray-900">
                      {productName}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold text-gray-900">
                    ${(productPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUTTON */}
        <div className="pt-2">
          <Button
            onClick={placeOrder}
            disabled={placingOrder}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}