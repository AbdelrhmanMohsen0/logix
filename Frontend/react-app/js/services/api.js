const API_BASE_AUTH = "http://localhost:8081";
const API_BASE_ORDER = "http://localhost:8082";
/* -------- Token helpers -------- */
const TokenService = {
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
/* -------- Generic fetch wrapper -------- */
async function apiFetch(baseUrl, path, options = {}) {
  const token = TokenService.get();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      msg = body.message || body.error || JSON.stringify(body);
    } catch (_) {
      /* ignore parse error */
    }
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
/* ======== AUTH SERVICE ======== */
const AuthAPI = {
  async login(email, password) {
    try {
      return await apiFetch(API_BASE_AUTH, "/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.warn(
        "Auth-service unavailable/CORS, using mock login:",
        err.message,
      );
      await _delay(500);
      const payload = btoa(JSON.stringify({ sub: email, role: "ROLE_OWNER" }));
      return { token: `mock.${payload}.sig` };
    }
  },
  async signup({ organizationName, email, adminName, password }) {
    try {
      return await apiFetch(API_BASE_AUTH, "/signup", {
        method: "POST",
        body: JSON.stringify({ organizationName, email, adminName, password }),
      });
    } catch (err) {
      console.warn(
        "Auth-service unavailable/CORS, using mock signup:",
        err.message,
      );
      await _delay(500);
      return { message: "Mock signup successful" };
    }
  },
};
/* ======== USER SERVICE (MOCK — backend endpoints not yet implemented) ======== */
let _mockUsers = [
  {
    id: "1",
    name: "Alex Carter",
    email: "alex@logix.io",
    role: "ROLE_OWNER",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Jordan Lee",
    email: "jordan@logix.io",
    role: "ROLE_ADMIN",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Sam Rivera",
    email: "sam@logix.io",
    role: "ROLE_MANAGER",
    createdAt: "2025-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Morgan Chen",
    email: "morgan@logix.io",
    role: "ROLE_SALES",
    createdAt: "2025-04-05T11:45:00Z",
  },
  {
    id: "5",
    name: "Taylor Kim",
    email: "taylor@logix.io",
    role: "ROLE_WORKER",
    createdAt: "2025-05-18T08:20:00Z",
  },
];
let _nextUserId = 6;
const UserAPI = {
  async getUsers() {
    await _delay(400);
    return [..._mockUsers];
  },
  async getUser(id) {
    await _delay(300);
    const user = _mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return {
      ...user,
    };
  },
  async createUser(data) {
    await _delay(500);
    const newUser = {
      id: String(_nextUserId++),
      ...data,
      createdAt: new Date().toISOString(),
    };
    _mockUsers.push(newUser);
    return {
      ...newUser,
    };
  },
  async updateUser(id, data) {
    await _delay(400);
    const idx = _mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    _mockUsers[idx] = {
      ..._mockUsers[idx],
      ...data,
    };
    return {
      ..._mockUsers[idx],
    };
  },
  async deleteUser(id) {
    await _delay(400);
    _mockUsers = _mockUsers.filter((u) => u.id !== id);
    return null;
  },
};
/* ======== ORDER SERVICE ======== */
let _mockOrders = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    customerName: "Acme Corp",
    customerPhone: "+1-555-0100",
    customerAddress: "123 Business Ave, New York, NY 10001",
    orderStatus: "DELIVERED",
    totalAmount: 2499.97,
    items: [
      {
        SKU: "ELEC-001",
        name: "Wireless Keyboard",
        quantity: 3,
        priceAtPurchase: 79.99,
      },
      {
        SKU: "ELEC-002",
        name: "4K Monitor",
        quantity: 2,
        priceAtPurchase: 1129.99,
      },
    ],
    statusHistory: [
      {
        status: "CREATED",
        transitionedAt: "2025-10-20T09:00:00Z",
      },
      {
        status: "CONFIRMED",
        transitionedAt: "2025-10-20T10:30:00Z",
      },
      {
        status: "PACKED",
        transitionedAt: "2025-10-21T08:00:00Z",
      },
      {
        status: "SHIPPED",
        transitionedAt: "2025-10-21T14:00:00Z",
      },
      {
        status: "DELIVERED",
        transitionedAt: "2025-10-24T11:30:00Z",
      },
    ],
    createdAt: "2025-10-20T09:00:00Z",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    customerName: "TechStart Ltd",
    customerPhone: "+1-555-0200",
    customerAddress: "456 Innovation Blvd, Chicago, IL 60601",
    orderStatus: "SHIPPED",
    totalAmount: 649.95,
    items: [
      {
        SKU: "OFF-010",
        name: "Ergonomic Chair",
        quantity: 5,
        priceAtPurchase: 129.99,
      },
    ],
    statusHistory: [
      {
        status: "CREATED",
        transitionedAt: "2025-10-22T11:00:00Z",
      },
      {
        status: "CONFIRMED",
        transitionedAt: "2025-10-22T12:00:00Z",
      },
      {
        status: "PACKED",
        transitionedAt: "2025-10-23T09:00:00Z",
      },
      {
        status: "SHIPPED",
        transitionedAt: "2025-10-23T15:00:00Z",
      },
    ],
    createdAt: "2025-10-22T11:00:00Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    customerName: "Global Supplies Inc",
    customerPhone: "+1-555-0300",
    customerAddress: "789 Commerce St, Austin, TX 73301",
    orderStatus: "PENDING",
    totalAmount: 189.97,
    items: [
      {
        SKU: "STAT-005",
        name: "Notebook Bundle",
        quantity: 1,
        priceAtPurchase: 49.99,
      },
      {
        SKU: "STAT-008",
        name: "Pen Set Premium",
        quantity: 2,
        priceAtPurchase: 34.99,
      },
      {
        SKU: "STAT-012",
        name: "Desk Organizer",
        quantity: 1,
        priceAtPurchase: 69.99,
      },
    ],
    statusHistory: [
      {
        status: "CREATED",
        transitionedAt: "2025-10-24T14:00:00Z",
      },
      {
        status: "PENDING",
        transitionedAt: "2025-10-24T14:30:00Z",
      },
    ],
    createdAt: "2025-10-24T14:00:00Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    customerName: "Redwood Partners",
    customerPhone: "+1-555-0400",
    customerAddress: "321 Oak Rd, Seattle, WA 98101",
    orderStatus: "CREATED",
    totalAmount: 3450.0,
    items: [
      {
        SKU: "FURN-020",
        name: "Standing Desk",
        quantity: 10,
        priceAtPurchase: 345.0,
      },
    ],
    statusHistory: [
      {
        status: "CREATED",
        transitionedAt: "2025-10-25T08:00:00Z",
      },
    ],
    createdAt: "2025-10-25T08:00:00Z",
  },
];
let _nextMockOrderId = 5;
const OrderAPI = {
  async createOrder(data) {
    try {
      return await apiFetch(API_BASE_ORDER, "/order", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Order-service unavailable, using mock:", err.message);
      await _delay(500);
      const total = data.items.reduce(
        (s, i) => s + i.quantity * i.priceAtPurchase,
        0,
      );
      const newOrder = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : `mock-${_nextMockOrderId++}`,
        ...data,
        orderStatus: "CREATED",
        totalAmount: total,
        statusHistory: [
          {
            status: "CREATED",
            transitionedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };
      _mockOrders.unshift(newOrder);
      return newOrder;
    }
  },
  async getOrders() {
    await _delay(400);
    return _mockOrders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      orderStatus: o.orderStatus,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      itemCount: o.items.length,
    }));
  },
  async getOrder(id) {
    await _delay(300);
    const order = _mockOrders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return {
      ...order,
    };
  },
  async updateOrderStatus(id, status) {
    await _delay(400);
    const order = _mockOrders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      transitionedAt: new Date().toISOString(),
    });
    return {
      ...order,
    };
  },
};
/* -------- Helpers -------- */
function _delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}
