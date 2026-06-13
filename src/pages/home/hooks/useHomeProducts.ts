import { useEffect } from "react";
import { useApp } from "../../../contexts/AppContext";
import { getAllProducts } from "../../../api/productApi";

export const useHomeProducts = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();

      const mapped = data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        category: item.categoryName,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl, 
        description: item.description,
        nutrition: {
          calories: item.nutritionFact?.calories || 0,
          protein: item.nutritionFact?.protein || 0,
          carbs: item.nutritionFact?.carbs || 0,
          fat: item.nutritionFact?.fat || 0,
          fiber: item.nutritionFact?.fiber || 0,
        },
        inStock: item.inStock,
      }));

      dispatch({ type: "SET_PRODUCTS", products: mapped });
    };

    fetchProducts();
  }, [dispatch]);

  return state.products;
};