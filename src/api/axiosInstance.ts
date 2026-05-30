import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://final-project-api-production-6257.up.railway.app/api",
});

// متغيرات للتحكم في الطلبات المتزامنة
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ================= REQUEST =================
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/Auth/refresh") &&
      !originalRequest.url.includes("/Auth/logout")
    ) {
      // لو في طلب بيعمل Refresh حالياً، حط الطلب ده في الطابور
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axiosInstance.post("/Auth/refresh", {
          refreshToken,
        });

        const newToken = res.data.token;

        // 💾 save new token
        localStorage.setItem("token", newToken);

        // تحديث الهيدر للطلب الأصلي
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // تنفيذ الطلبات اللي كانت متعطلة في الطابور
        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // لو الـ Refresh فشل، نرفض كل الطلبات اللي في الطابور
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // 🛑 الحل الجذري لمشكلة الريلود المستمر
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        // فتح الباب تاني بعد ما الـ Refresh يخلص سواء بنجاح أو فشل
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ================= LOGOUT FUNCTION =================
export const logoutApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await axiosInstance.post("/Auth/logout", {
        refreshToken,
      });
    }
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // توجيه لصفحة اللوجين بعد تسجيل الخروج
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
};

export default axiosInstance;