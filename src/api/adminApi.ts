import axiosInstance from "./axiosInstance";

// ================= USERS =================

// GET ALL USERS (Admin)
export const getAllUsers = async () => {
  const res = await axiosInstance.get("/Users");
  return res.data;
};

// TOGGLE USER STATUS (Admin)
export const updateUserStatus = async (id, isActive) => {
  const res = await axiosInstance.put(`/Users/${id}/status`, {
    isActive,
  });
  return res.data;
};

// ================= CATEGORIES =================

// GET Categories by type (1 = recipe, 2 = product)
export const getCategories = async (type) => {
  const res = await axiosInstance.get(`/Categories/${type}`);
  return res.data;
};

export const getAllCategories = async () => {
  try {
    const [recipeRes, productRes] = await Promise.all([
      axiosInstance.get("/Categories/1"), // recipe
      axiosInstance.get("/Categories/2"), // product
    ]);

    const recipe = recipeRes.data.map((item) => ({
      ...item,
      type: 1,
    }));

    const product = productRes.data.map((item) => ({
      ...item,
      type: 2,
    }));

    return [...recipe, ...product];

  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ADD CATEGORY
export const createCategory = async (data) => {
  const res = await axiosInstance.post("/Categories", data);
  return res.data;
};

// UPDATE CATEGORY
// ================= Orders =================

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

// GET ALL ORDERS (Admin)
export const getAllOrders = async () => {
  // Changed from "/orders" to "/admin/orders"
  const res = await axiosInstance.get("/admin/orders");
  return res.data;
};

// GET ORDER BY ID (Admin)
export const getOrderById = async (id: string | number) => {
  // Changed from "/orders" to "/admin/orders"
  const res = await axiosInstance.get(`/admin/orders/${id}`);
  return res.data;
};

// UPDATE ORDER STATUS (Admin)
// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (id: string | number, status: OrderStatus) => {
  
  // This converts the number (e.g., 1) back into the string (e.g., "Confirmed")
  // which exactly matches what your Swagger UI is asking for.
  const statusString = OrderStatus[status]; 
  
  const res = await axiosInstance.put(`/admin/orders/${id}/status`, { 
    status: statusString 
  });
  
  return res.data;
};
