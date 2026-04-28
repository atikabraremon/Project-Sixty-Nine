import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

// ১. Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ২. Response Interceptor (একটাই যথেষ্ট, আলাদা গ্লোবাল ইন্টারসেপ্টর দরকার নেই)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;

    // যদি ৪০১ এরর আসে
    if (error.response?.status === 401) {
      // গুরুত্বপূর্ণ: যদি ইউজার লগইন পেজে থাকে, তবে রিফ্রেশ বা অটো-লগআউট করা যাবে না
      // এতে ইউজার ব্যাকএন্ডের এরর মেসেজটি (যেমন: Not Verified) দেখতে পারবে।
      if (currentPath.includes("/login")) {
        return Promise.reject(error);
      }

      // যদি লগইন পেজে না থাকে এবং আগে রিট্রাই করা না হয়ে থাকে (Token Refresh Logic)
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // সরাসরি axios ইউজ করা ভালো যাতে ইন্টারসেপ্টর লুপে না পড়ে
          const { data } = await axios.post(
            "http://localhost:8000/api/v1/users/refresh-token",
            {},
            { withCredentials: true },
          );

          const newAccessToken = data.data.accessToken;

          Cookies.set("accessToken", newAccessToken, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          // রিফ্রেশ টোকেন ফেল করলে লগআউট
          localStorage.removeItem("isLoggedIn");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

// --- Generic Request Functions ---
export const postRequest = async (url, data, isFormData = false) => {
  const config = {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  };
  const response = await API.post(url, data, config);
  return response.data;
};

// --- Auth Services ---
export const registerUser = (formData) =>
  postRequest("/users/register", formData, true);
export const loginUser = (credentials) =>
  postRequest("/users/login", credentials, false);

export const logoutUser = async () => {
  const response = await API.post("/users/logout");
  localStorage.removeItem("isLoggedIn");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  return response.data;
};

export default API;
