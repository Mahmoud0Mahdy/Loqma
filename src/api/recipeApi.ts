import axiosInstance from "./axiosInstance";

// ================= USER RECIPES =================

// 🔥 Recommendation API
export const getAllRecipes = async (
  excludeRecipeIds: number[] = []
) => {
  const res = await axiosInstance.post(
    "/Recommendation",
    excludeRecipeIds
  );

  return res.data;
};

// ================= ADMIN RECIPES =================

// 🔥 Admin Pagination API
export const getAdminRecipes = async (
  pageNumber: number = 1,
  pageSize: number = 30
) => {
  const res = await axiosInstance.get("/Recipes", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return res.data;
};

// 🔥 GET RECIPE BY ID
export const getRecipeById = async (
  id: string | number
) => {
  const res = await axiosInstance.get(
    `/Recipes/${id}`
  );

  return res.data;
};

// 🔥 CREATE RECIPE (Admin)
export const createRecipe = async (
  data: any
) => {
  const res = await axiosInstance.post(
    "/Recipes",
    data
  );

  return res.data;
};

// 🔥 UPDATE RECIPE (Admin)
export const updateRecipe = async (
  id: string | number,
  data: any
) => {
  await axiosInstance.put(
    `/Recipes/${id}`,
    data
  );
};

// 🔥 DELETE RECIPE (Admin)
export const deleteRecipe = async (
  id: string | number
) => {
  await axiosInstance.delete(
    `/Recipes/${id}`
  );
};