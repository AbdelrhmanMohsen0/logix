# Warehouse Service API Documentation

This document provides the API specifications for the `warehouse-service`, designed for frontend integration.

## Global Requirements
All endpoints in this service require the user to be authenticated and authorized.
* **Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Role:** User must have the `WORKER` role.
* **Token Claim:** The JWT must contain an `org` claim with a valid UUID representing the Organization ID.
* **Authentication Edge Case (All Endpoints):**
    * Missing/Invalid Token -> `401 Unauthorized`
    * Valid Token but missing `WORKER` role -> `403 Forbidden`

---

## 1. Inbound Shipments

### Get Inbound Shipments
Retrieves a paginated list of all inbound shipments for the worker's organization.

* **URL:** `/warehouse/inbound`
* **Method:** `GET`

#### Query Parameters
* `page` (optional, integer): The page index to retrieve. Default is `0`.
* `size` (optional, integer): The number of items per page. Default is `10`.

#### Request Example
```http
GET /warehouse/inbound?page=0&size=10 HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
```json
{
  "content": [
    {
      "shipmentID": "INB-98765",
      "supplierName": "Global Tech Suppliers Ltd",
      "totalNumberOfItems": 1500,
      "receivingDate": "2026-05-03T10:15:30Z"
    },
    {
      "shipmentID": "INB-98766",
      "supplierName": "Office Essentials Inc",
      "totalNumberOfItems": 250,
      "receivingDate": "2026-05-02T14:20:00Z"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

#### Edge Case Responses
**Scenario: No inbound shipments exist for the organization (200 OK)**
```json
{
  "content": [],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

---

## 2. Orders & Picking

### Get Picking List
Retrieves a paginated summary list of orders that are ready to be picked (`PENDING`) or are currently being picked (`IN_PROGRESS`).

* **URL:** `/warehouse/orders`
* **Method:** `GET`

#### Query Parameters
* `page` (optional, integer): The page index to retrieve. Default is `0`.
* `size` (optional, integer): The number of items per page. Default is `10`.

#### Request Example
```http
GET /warehouse/orders?page=0&size=10 HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
```json
{
  "content": [
    {
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "orderDisplayIndex": "ORD-10001",
      "numberOfItems": 12,
      "orderWarehouseStatus": "PENDING"
    },
    {
      "orderId": "660e8400-e29b-41d4-a716-446655440001",
      "orderDisplayIndex": "ORD-10002",
      "numberOfItems": 3,
      "orderWarehouseStatus": "IN_PROGRESS"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

#### Edge Case Responses
**Scenario: No orders available for picking (200 OK)**
```json
{
  "content": [],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

---

### Get Order Details (Start Picking)
Fetches the full details of an order, including the items to pick and their warehouse locations.
**Side Effect:** Calling this endpoint locks the order for 15 minutes, assigning it to the worker and changing its status to `IN_PROGRESS`.

* **URL:** `/warehouse/orders/{orderId}`
* **Method:** `GET`

#### Request Example
```http
GET /warehouse/orders/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "orderDisplayIndex": "ORD-10001",
  "orderStatus": "IN_PROGRESS",
  "numberOfItems": 2,
  "labelURI": "[https://example.com](https://example.com)",
  "items": [
    {
      "sku": "SKU-LAPTOP-01",
      "name": "15-inch Pro Laptop",
      "quantity": 1,
      "location": "Aisle 4, Rack B, Shelf 2"
    },
    {
      "sku": "SKU-MOUSE-05",
      "name": "Wireless Ergonomic Mouse",
      "quantity": 1,
      "location": "Aisle 1, Rack A, Shelf 1"
    }
  ]
}
```

#### Edge Case Responses

**Scenario: Order does not exist or belongs to a different organization (404 Not Found)**
```json
{
  "status": 404,
  "message": "No order found with id: 550e8400-e29b-41d4-a716-446655440000",
  "errors": null
}
```

**Scenario: Order is already locked and being picked by another worker (423 Locked)**
```json
{
  "status": 423,
  "message": "Order is currently locked and being processed by another worker.",
  "errors": null
}
```

---

### Mark Order as Packed
Completes the picking process and marks the order as `PACKED`. This releases the picking lock.

* **URL:** `/warehouse/orders/{orderId}/pack`
* **Method:** `POST`

#### Request Example
```http
POST /warehouse/orders/550e8400-e29b-41d4-a716-446655440000/pack HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
*(Empty Body)*

#### Edge Case Responses
**Scenario: Order not found or incorrect organization (404 Not Found)**
```json
{
  "status": 404,
  "message": "No order found with id: 550e8400-e29b-41d4-a716-446655440000",
  "errors": null
}
```

---

### Cancel Order Picking Lock
Cancels an active picking session. This releases the 15-minute lock on the order and reverts its status back to `PENDING` so it can be picked by someone else.

* **URL:** `/warehouse/orders/{orderId}/cancel`
* **Method:** `POST`

#### Request Example
```http
POST /warehouse/orders/550e8400-e29b-41d4-a716-446655440000/cancel HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
*(Empty Body)*

#### Edge Case Responses
**Scenario: Order not found or incorrect organization (404 Not Found)**
```json
{
  "status": 404,
  "message": "No order found with id: 550e8400-e29b-41d4-a716-446655440000",
  "errors": null
}
```

---

## 3. Shipments (Outbound)

### Get Ready Shipments
Retrieves a paginated list of all orders that have been packed and are ready to be shipped out.

* **URL:** `/warehouse/shipments`
* **Method:** `GET`

#### Query Parameters
* `page` (optional, integer): The page index to retrieve. Default is `0`.
* `size` (optional, integer): The number of items per page. Default is `10`.

#### Request Example
```http
GET /warehouse/shipments?page=0&size=10 HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
```json
{
  "content": [
    {
      "orderId": "770e8400-e29b-41d4-a716-446655440002",
      "orderDisplayIndex": "ORD-10003",
      "customerName": "Jane Doe",
      "customerAddress": "123 Maple Street, Springfield, IL 62704"
    },
    {
      "orderId": "880e8400-e29b-41d4-a716-446655440003",
      "orderDisplayIndex": "ORD-10004",
      "customerName": "Acme Corp",
      "customerAddress": "987 Industrial Blvd, Metropolis, NY 10001"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

#### Edge Case Responses
**Scenario: No packed orders waiting for shipment (200 OK)**
```json
{
  "content": [],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

---

### Mark Shipment as Shipped
Updates the status of a packed order to `SHIPPED` indicating it has left the warehouse. Note: The URL parameter is `shipmentId`, but it corresponds to the `orderId` in the backend.

* **URL:** `/warehouse/shipments/{shipmentId}/ship`
* **Method:** `POST`

#### Request Example
```http
POST /warehouse/shipments/770e8400-e29b-41d4-a716-446655440002/ship HTTP/1.1
Authorization: Bearer eyJhbG...
```

#### Success Response (200 OK)
*(Empty Body)*

#### Edge Case Responses
**Scenario: Shipment (Order) not found or incorrect organization (404 Not Found)**
```json
{
  "status": 404,
  "message": "No order found with id: 770e8400-e29b-41d4-a716-446655440002",
  "errors": null
}
```