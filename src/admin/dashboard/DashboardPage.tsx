import { useEffect, useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { DashboardStats } from "./components/DashboardStats";
import { DashboardDetails } from "./components/DashboardDetails";

import { getAllUsers, getAllCategories } from "../../api/adminApi";
import { getAllPosts } from "../../api/communityApi";
import { getAllRecipes } from "../../api/recipeApi";
import axiosInstance from "../../api/axiosInstance";

import "..//dashboard/components/Dashboard-admin.css";

export function DashboardPage() {
  const { dispatch } = useApp();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Store dashboard counts
  const [counts, setCounts] = useState({ products: 0, recipes: 0, posts: 0 });

  useEffect(() => {
    // Load dashboard data
    const fetchData = async () => {
      setLoading(true);

      try {
        const [usersData, catsData, postsData, recipesData, productsRes] =
          await Promise.all([
            getAllUsers().catch(() => []),
            getAllCategories().catch(() => []),
            getAllPosts().catch(() => []),
            getAllRecipes().catch(() => []),
            axiosInstance.get("/Products").catch(() => ({ data: [] })),
          ]);

        setUsers(usersData || []);
        setCategories(catsData || []);
        dispatch({ type: "SET_CATEGORIES", categories: catsData || [] });

        // Normalize posts response
        const pData = Array.isArray(postsData)
          ? postsData
          : postsData?.data || [];

        setCounts({
          products: productsRes.data?.length || 0,
          recipes: recipesData?.length || 0,
          posts: pData.length || 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Dashboard header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your system's statistics and data.
        </p>
      </div>

      {/* Statistics overview */}
      <DashboardStats
        usersCount={users.length}
        counts={counts}
        loading={loading}
      />

      {/* Detailed analytics */}
      <DashboardDetails
        users={users}
        categories={categories}
        counts={counts}
        loading={loading}
      />
    </div>
  );
}
