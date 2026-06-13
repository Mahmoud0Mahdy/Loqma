import axiosInstance from "./axiosInstance";

// ================= PRODUCTS =================

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  const res = await axiosInstance.get("/Products");
  return res.data;
};

// GET PRODUCT BY ID
export const getProductById = async (id) => {
  const res = await axiosInstance.get(`/Products/${id}`);
  return res.data;
};

// CREATE PRODUCT (Admin)
export const createProduct = async (data) => {
  const res = await axiosInstance.post("/Products", data);
  return res.data; 
};

// UPDATE PRODUCT (Admin)
export const updateProduct = async (id, data) => {
  await axiosInstance.put(`/Products/${id}`, data);
};

//  DELETE PRODUCT (Admin)
export const deleteProduct = async (id) => {
  await axiosInstance.delete(`/Products/${id}`);
};