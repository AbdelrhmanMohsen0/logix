import axios from 'axios';

const API_BASE_AUTH = "http://127.0.0.1:8081";
const API_BASE_ORDER = "http://127.0.0.1:8082";
const API_BASE_INVENTORY = "http://127.0.0.1:8083";
const API_BASE_WAREHOUSE = "http://127.0.0.1:8084";

/* -------- Token helpers -------- */
export const TokenService = {
  get() {
    return localStorage.getItem("logix_token");
  },
  set(t) {
    localStorage.setItem("logix_token", t);
  },
  remove() {
    localStorage.removeItem("logix_token");
  },
};

/* -------- Axios Instances -------- */
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = TokenService.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      // Extract detailed error messages if available
      let message = error.message;
      if (error.response?.data) {
        const data = error.response.data;
        message = data.message || data.error || message;

        // If there are specific validation errors, append them
        if (Array.isArray(data.errors)) {
          const detail = data.errors.map(e => `${e.field}: ${e.message}`).join(", ");
          message = `${message} (${detail})`;
        }
      }
      return Promise.reject(new Error(message));
    }
  );

  return client;
};

const authClient = createClient(API_BASE_AUTH);
const orderClient = createClient(API_BASE_ORDER);
const inventoryClient = createClient(API_BASE_INVENTORY);
const warehouseClient = createClient(API_BASE_WAREHOUSE);

// Special interceptor for services requiring Organization ID
orderClient.interceptors.request.use((config) => {
  const token = TokenService.get();
  if (token) {
    try {
      const decoded = parseJwt(token);
      if (decoded && decoded.org) {
        config.headers["X-Organization-ID"] = decoded.org;
      }
    } catch (e) {
      console.error("Failed to parse org ID from token", e);
    }
  }
  return config;
});

/* ======== AUTH SERVICE ======== */
export const AuthAPI = {
  async login(email, password) {
    return authClient.post("/login", { email, password });
  },
  async signup(data) {
    return authClient.post("/signup", data);
  },
};

/* ======== USER SERVICE ======== */
export const UserAPI = {
  async getUsers() {
    return authClient.get("/users");
  },
  async getUserMe() {
    return authClient.get("/users/me");
  },
  async getUser(id) {
    return authClient.get(`/users/${id}`);
  },
  async createUser(data) {
    return authClient.post("/users", data);
  },
  async updateUser(id, data) {
    return authClient.put(`/users/${id}`, data);
  },
  async deleteUser(id) {
    return authClient.delete(`/users/${id}`);
  },
};

/* ======== ORDER SERVICE ======== */
export const OrderAPI = {
  async createOrder(data) {
    return orderClient.post("/order", data);
  },
  async getOrders() {
    return orderClient.get("/");
  },
  async getOrder(id) {
    return orderClient.get(`/${id}`);
  },
  async updateOrderStatus(id, status) {
    return orderClient.put(`/${id}/status`, { status });
  },
};

/* ======== INVENTORY SERVICE ======== */
export const InventoryAPI = {
  async getItems() {
    return inventoryClient.get("/inventory");
  },
  async updateStock(id, qty) {
    return inventoryClient.patch(`/inventory/${id}`, { qty });
  },
};

/* -------- Helpers -------- */
export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}
