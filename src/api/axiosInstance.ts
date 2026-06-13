import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7058/api",
});

// Tracks refresh state to prevent multiple refresh requests
let isRefreshing = false;

// Stores requests that fail while a token refresh is in progress
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token!);
    }
  });

  failedQueue = [];
};

// Attach access token to every outgoing request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired tokens and retry failed requests
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/Auth/refresh") &&
      !originalRequest?.url?.includes("/Auth/logout")
    ) {
      // Wait for the current refresh request if one is already running
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
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

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle any remaining unauthorized requests
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Logout current user and clear local session data
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

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
};

export default axiosInstance;
