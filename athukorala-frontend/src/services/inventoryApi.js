import axios from "axios";

// 🔹 Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // 🔥 IMPORTANT for CORS
});

// 🔐 REQUEST INTERCEPTOR (attach JWT)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // 🔥 DEBUG (optional)
    console.log("TOKEN:", token);

    if (token && token !== "null" && token !== "undefined") {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {

      // 🔥 401 → not logged in
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }

      // 🔥 403 → forbidden (role issue or CORS)
      if (error.response.status === 403) {
        console.warn("Forbidden! Check role or CORS.");
      }

    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ---------- AUTH ----------

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // 🔥 VERY IMPORTANT
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const registerUser = (data) =>
  API.post("/auth/register", data);

// ---------- INVENTORY ----------

export const getInventory = async () => {
  const res = await API.get("/inventory");
  return res.data;
};

export const getProductInventory = async (id) => {
  const res = await API.get(`/inventory/${id}`);
  return res.data;
};

export const getMovements = async (id) => {
  const res = await API.get(`/inventory/${id}/movements`);
  return res.data;
};

export const stockIn = (data) =>
  API.post("/inventory/stock-in", data);

export const stockOut = (data) =>
  API.post("/inventory/stock-out", data);

export const adjustStock = (data) =>
  API.post("/inventory/adjust", data);

export const getLowStock = async () => {
  const res = await API.get("/inventory/low-stock");
  return res.data;
};

export const getReorderList = async () => {
  const res = await API.get("/inventory/reorder-list");
  return res.data;
};

export const updateReorder = (id, data) =>
  API.put(`/inventory/${id}/reorder`, data);

export const deleteMovement = (id) =>
  API.delete(`/inventory/movements/${id}`);

// ---------- SUPPLIERS ----------

export const getSuppliers = async () => {
  const res = await API.get("/suppliers");
  return res.data;
};

export const addSupplier = (data) =>
  API.post("/suppliers", data);

export const updateSupplier = (id, data) =>
  API.put(`/suppliers/${id}`, data);

export const deleteSupplier = (id) =>
  API.delete(`/suppliers/${id}`);

export const linkSupplier = (data) =>
  API.post("/suppliers/link", data);

export const getSuppliersByProduct = async (id) => {
  const res = await API.get(`/suppliers/by-product/${id}`);
  return res.data;
};

// ---------- USERS ----------

export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const unlinkSupplier = (productId, supplierId) =>
  API.delete(`/suppliers/unlink?productId=${productId}&supplierId=${supplierId}`);

export default API;