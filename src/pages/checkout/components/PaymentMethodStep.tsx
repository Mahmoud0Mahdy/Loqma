import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";

import {
  CreditCard,
  Banknote,
} from "lucide-react";

import { toast } from "sonner";

import { placeOrder } from "../../../api/orderApi";

import { useCheckout } from "../../../contexts/CheckoutContext";

export function PaymentMethodStep({
  setStep,
  formData,
}: any) {

  const [loading, setLoading] =
    useState(false);

  const {
    checkoutData,
    setCheckoutField,
  } = useCheckout();

  const handleSelectMethod = async (
    paymentMethodId: number
  ) => {

    try {

      setLoading(true);

      // save payment method
      setCheckoutField(
        "paymentMethodId",
        paymentMethodId
      );

      // CASH
      if (paymentMethodId === 2) {

        toast.success(
          "Cash payment selected"
        );

        setStep(5);

        return;
      }

      // =====================================
      // CARD FLOW
      // =====================================

      const payload = {

        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,

        source:
          checkoutData.source,

        productId:
          checkoutData.productId,

        quantity:
          checkoutData.quantity,

        paymentMethodId: 1,

        requestId:
          checkoutData.requestId,
      };

      console.log(
        "CREATE CARD ORDER:",
        payload
      );

      // create order first
      const response =
        await placeOrder(payload);

      console.log(
        "ORDER CREATED:",
        response
      );

      // save orderId
      setCheckoutField(
        "orderId",
        response.id
      );

      toast.success(
        "Card payment selected"
      );

      // go to saved cards
      setStep(3);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to create payment order"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <Card className="shadow-sm border border-gray-200">

      <CardHeader>

        <CardTitle className="text-xl font-semibold">
          Choose Payment Method
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {/* CARD */}
        <button
          onClick={() =>
            handleSelectMethod(1)
          }
          disabled={loading}
          className="w-full border rounded-xl p-5 flex items-center justify-between hover:border-green-600 transition"
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">

              <CreditCard
                className="text-green-600"
                size={22}
              />

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-gray-900">
                Credit / Debit Card
              </h3>

              <p className="text-sm text-gray-500">
                Pay securely using your saved cards
              </p>

            </div>

          </div>

        </button>

        {/* CASH */}
        <button
          onClick={() =>
            handleSelectMethod(2)
          }
          disabled={loading}
          className="w-full border rounded-xl p-5 flex items-center justify-between hover:border-green-600 transition"
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">

              <Banknote
                className="text-orange-600"
                size={22}
              />

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-gray-900">
                Cash On Delivery
              </h3>

              <p className="text-sm text-gray-500">
                Pay when your order arrives
              </p>

            </div>

          </div>

        </button>

        {loading && (

          <Button
            disabled
            className="w-full"
          >
            Processing...
          </Button>
        )}

      </CardContent>

    </Card>
  );
}