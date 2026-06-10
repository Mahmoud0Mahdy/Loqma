// src/api/authApi.ts

import axiosInstance from "./axiosInstance";

// ================= REGISTER =================
export const registerUser = async (data: any) => {
  try {
    const response = await axiosInstance.post("/Auth/register", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};

// ================= LOGIN =================
export const loginUser = async (data: any) => {
  try {
    const response = await axiosInstance.post("/Auth/login", data);
    return response.data; // { token, refreshToken }
  } catch (error: any) {
    throw error.response?.data;
  }
};

// ================= LOGOUT =================
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/Auth/logout");
    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.put(
      "/Users/change-password",
      data
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};