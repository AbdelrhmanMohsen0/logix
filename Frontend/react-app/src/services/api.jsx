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
    return orderClient.post("/orders", data);
  },
  async getOrders() {
    return orderClient.get("/orders");
  },
  async getOrder(id) {
    return orderClient.get(`/orders/${id}`);
  },
};

/* ======== INVENTORY SERVICE ======== */
export const InventoryAPI = {
  async getProducts(page = 0, size = 50, stock = "ALL") {
    return inventoryClient.get(`/inventory/products?page=${page}&size=${size}&stock=${stock}`);
  },
  async searchProducts(query) {
    return inventoryClient.get(`/inventory/products/search?query=${query}`);
  },
  async createProduct(data) {
    return inventoryClient.post("/inventory/products", data);
  },
  async updateProduct(data) {
    return inventoryClient.put("/inventory/products", data);
  },
  async deleteProduct(sku) {
    return inventoryClient.delete(`/inventory/products/${sku}`);
  },
  async processShipment(data) {
    return inventoryClient.patch("/inventory/stock", data);
  },
};

/* ======== WAREHOUSE SERVICE ======== */
export const WarehouseAPI = {
  async getInbound() {
    return warehouseClient.get("/warehouse/inbound");
  },
  async receiveInbound(data) {
    return warehouseClient.post("/warehouse/inbound", data);
  },
  async getPickingList() {
    return warehouseClient.get("/warehouse/orders");
  },
  async startPicking(id) {
    return warehouseClient.get(`/warehouse/orders/${id}`);
  },
  async packOrder(id) {
    return warehouseClient.post(`/warehouse/orders/${id}/pack`);
  },
  async cancelPicking(id) {
    return warehouseClient.post(`/warehouse/orders/${id}/cancel`);
  },
  async getOutbound() {
    return warehouseClient.get("/warehouse/shipments");
  },
  async shipOrder(shipmentId) {
    return warehouseClient.post(`/warehouse/shipments/${shipmentId}/ship`);
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
