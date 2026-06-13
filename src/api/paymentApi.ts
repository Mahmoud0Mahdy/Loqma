import axiosInstance from "./axiosInstance";

// Start a payment session
export const startPayment = async (paymentMethod: number) => {
  const paymentMethodValue = paymentMethod === 1 ? "Card" : "Cash";

  const response = await axiosInstance.post("/Payment/start", {
    paymentMethod: paymentMethodValue,
  });

  return response.data;
};

// Confirm payment
export const confirmPayment = async (
  orderId: number,
  payload: {
    paymentMethodId: number;
    savePayment: boolean;
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  },
) => {
  const response = await axiosInstance.post(
    `/Payment/confirm?orderId=${orderId}`,
    payload,
  );

  return response.data;
};

// Get saved payment cards
export const getSavedCards = async () => {
  const response = await axiosInstance.get("/Payment/saved");

  return response.data;
};

// Pay using a saved card
export const payWithSavedCard = async (
  orderId: number,
  savedCardId: number,
) => {
  const response = await axiosInstance.post(
    `/Payment/pay-with-saved?orderId=${orderId}`,
    {
      savedCardId,
    },
  );

  return response.data;
};

// Delete a saved card
export const deleteSavedCard = async (id: number) => {
  const response = await axiosInstance.delete(`/Payment/saved/${id}`);

  return response.data;
};
