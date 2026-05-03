# Order Service API Documentation

## Overview
This API allows the frontend application to manage orders.

### Authentication
All endpoints require authentication via a JWT token.
* **Header**: `Authorization: Bearer <your_jwt_token>`
* **Role Required**: `SALES`
* **Tenant Isolation**: The system extracts the Organization ID (`org`) automatically from the JWT token's attributes. You do not need to pass the organization ID in the request body or path.

### Enums

**OrderStatus**
Represents the current state of an order. Possible values:
* `CREATED`
* `CONFIRMED`
* `PROCESSING`
* `PACKED`
* `SHIPPED`
* `DELIVERED`
* `CANCELED`

---

## Endpoints

### 1. Create a New Order
Creates a new order for the authenticated user's organization.

* **Method:** `POST`
* **Path:** `/orders`
* **Content-Type:** `application/json`

#### Request Body (`OrderRequest`)
| Field | Type | Rules |
| :--- | :--- | :--- |
| `customerName` | String | Required (Not Blank) |
| `customerPhone` | String | Required (Not Blank) |
| `customerAddress` | String | Required (Not Blank) |
| `items` | Array of Objects | Required (Not Empty) |
| ↳ `items[].sku` | String | Required (Not Blank) |
| ↳ `items[].name` | String | Required (Not Blank) |
| ↳ `items[].quantity` | Number | Required, Must be > 0 |
| ↳ `items[].priceAtPurchase` | Number | Required, Must be > 0 |

**Example Request:**
```json
{
  "customerName": "Jane Doe",
  "customerPhone": "+1234567890",
  "customerAddress": "123 Tech Lane, Silicon Valley, CA",
  "items": [
    {
      "sku": "LAPTOP-01",
      "name": "ProBook 15",
      "quantity": 1,
      "priceAtPurchase": 1200.50
    },
    {
      "sku": "MOUSE-02",
      "name": "Wireless Mouse",
      "quantity": 2,
      "priceAtPurchase": 25.00
    }
  ]
}
```

#### Success Response (200 OK)
Returns the created `OrderDTO` with the initial status set to `CREATED`.

**Example Response:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Jane Doe",
  "customerPhone": "+1234567890",
  "customerAddress": "123 Tech Lane, Silicon Valley, CA",
  "orderCurrentStatus": "CREATED",
  "totalAmount": 1250.50,
  "items": [
    {
      "sku": "LAPTOP-01",
      "name": "ProBook 15",
      "quantity": 1,
      "priceAtPurchase": 1200.50
    },
    {
      "sku": "MOUSE-02",
      "name": "Wireless Mouse",
      "quantity": 2,
      "priceAtPurchase": 25.00
    }
  ],
  "statusHistory": [
    {
      "status": "CREATED",
      "transitionedAt": "2023-10-27T14:32:00Z"
    }
  ]
}
```

#### Edge Cases
**400 Bad Request (Validation Error)**
If required fields are missing or rules are violated (e.g., negative quantity, empty items array), Spring Boot will reject the request.

*Example Response (Missing Name & Negative Quantity):*
```json
{
  "timestamp": "2023-10-27T14:33:00Z",
  "status": 400,
  "error": "Bad Request",
  "path": "/orders"
}
```
*(Note: Exact 400 response structure depends on global Spring Boot configurations, but expect standard HTTP 400 behavior for failed `@Valid` annotations).*

---

### 2. Get Order Summaries
Retrieves a lightweight list of all orders belonging to the authenticated user's organization.

* **Method:** `GET`
* **Path:** `/orders`

#### Request Parameters
None.

#### Success Response (200 OK)
Returns an array of `OrderSummaryDTO`.

**Example Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerName": "Jane Doe",
    "orderDate": "2023-10-27T14:32:00Z",
    "currentStatus": "CREATED",
    "totalAmount": 1250.50
  },
  {
    "id": "a12b345c-678d-90ef-1234-56789abcdef0",
    "customerName": "Acme Corp",
    "orderDate": "2023-10-26T09:15:00Z",
    "currentStatus": "SHIPPED",
    "totalAmount": 4500.00
  }
]
```

#### Edge Cases
**200 OK (Empty State)**
If the organization has no orders, the API will return an empty array, not an error.

*Example Response:*
```json
[]
```

---

### 3. Get Order Details
Retrieves the full details of a specific order.

* **Method:** `GET`
* **Path:** `/orders/{id}`

#### Path Variables
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | The unique identifier of the order |

#### Success Response (200 OK)
Returns the full `OrderDTO` including line items and status transition history.

**Example Response:**
```json
{
  "orderId": "a12b345c-678d-90ef-1234-56789abcdef0",
  "customerName": "Acme Corp",
  "customerPhone": "+1987654321",
  "customerAddress": "99 Industrial Pkwy",
  "orderCurrentStatus": "SHIPPED",
  "totalAmount": 4500.00,
  "items": [
    {
      "sku": "SERVER-X",
      "name": "Enterprise Server Rack",
      "quantity": 1,
      "priceAtPurchase": 4500.00
    }
  ],
  "statusHistory": [
    {
      "status": "CREATED",
      "transitionedAt": "2023-10-26T09:15:00Z"
    },
    {
      "status": "CONFIRMED",
      "transitionedAt": "2023-10-26T10:00:00Z"
    },
    {
      "status": "PACKED",
      "transitionedAt": "2023-10-26T14:20:00Z"
    },
    {
      "status": "SHIPPED",
      "transitionedAt": "2023-10-27T08:00:00Z"
    }
  ]
}
```

#### Edge Cases
**404 Not Found**
If the order ID does not exist, or if it belongs to a *different* organization (preventing cross-tenant data leaks), the API returns a standardized error format managed by the `GlobalExceptionHandler`.

*Example Response:*
```json
{
  "timestamp": "2023-10-27T15:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Order with id a12b345c-678d-90ef-1234-56789abcdef0 not found",
  "path": "/orders/a12b345c-678d-90ef-1234-56789abcdef0"
}
```