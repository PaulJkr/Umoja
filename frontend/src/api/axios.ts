import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("=== API REQUEST ===");
  console.log("Base URL:", config.baseURL);
  console.log("Endpoint:", config.url);
  console.log("Full URL:", (config.baseURL || "") + (config.url || ""));
  console.log("Method:", config.method?.toUpperCase());
  console.log("Data:", config.data);
  console.log("Token found:", !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header added");
  } else {
    console.log("❌ No token found in localStorage");
  }

  return config;
});

// Add response interceptor to catch errors
api.interceptors.response.use(
  (response) => {
    console.log("=== API RESPONSE SUCCESS ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    return response;
  },
  (error) => {
    console.log("=== API RESPONSE ERROR ===");
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Error Data:", error.response?.data);
    console.log("Error Message:", error.message);

    if (error.response?.status === 401) {
      console.log("🔐 Authentication error - token might be invalid/expired");
    }

    return Promise.reject(error);
  }
);

export default api;
