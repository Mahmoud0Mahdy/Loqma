import axiosInstance from "./axiosInstance";

// GET PROFILE (address + fullName)
export const getUserProfile = async () => {
  const res = await axiosInstance.get("/UserProfile");
  return res.data;
};

// UPDATE PROFILE (address)
export const updateUserProfile = async (data) => {
  const res = await axiosInstance.put("/UserProfile", data);
  return res.data;
};

// GET ACCOUNT (first + last + email)
export const getUserAccount = async () => {
  const res = await axiosInstance.get("/Users/profile");
  return res.data;
};

// UPDATE ACCOUNT (first + last)
export const updateUserAccount = async (data) => {
  const res = await axiosInstance.put("/Users/profile", data);
  return res.data;
};