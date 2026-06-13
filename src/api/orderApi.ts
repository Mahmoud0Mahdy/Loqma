import axiosInstance from "./axiosInstance";

import { PlaceOrderPayload } from "../pages/orders/types/orderTypes";

// Create a new order
export const placeOrder = async (payload: PlaceOrderPayload) => {
  const response = await axiosInstance.post("/Order/place", payload);

  return response.data;
};

// Get all orders
export const getOrders = async () => {
  const response = await axiosInstance.get("/Order");

  return response.data;
};

// Get order details
export const getOrderDetails = async (id: number) => {
  const response = await axiosInstance.get(`/Order/${id}`);

  return response.data;
};

// Cancel an order
export const cancelOrder = async (id: number) => {
  const response = await axiosInstance.post(`/Order/${id}/cancel`);

  return response.data;
};
