# Inventory Service API Documentation

This document outlines the REST API endpoints available in the Inventory Service.

### Global Requirements
- **Authentication:** All endpoints require a valid JWT token passed in the `Authorization` header (`Bearer <token>`).
- **Organization Context:** The JWT token must contain an `org` claim representing the Organization UUID.
- **Base Path:** `/inventory`

---

## 1. Create a Product

Creates a new product in the organization's inventory.

**URL:** `/products`  
**Method:** `POST`  
**Required Role:** `MANAGER`

### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-10293",
  "quantity": 150,
  "price": 29.99,
  "location": "Aisle 4, Shelf B",
  "threshold": 20
}
```

### Responses

**Success (200 OK):**
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-10293",
  "quantity": 150,
  "price": 29.99,
  "location": "Aisle 4, Shelf B",
  "stockStatus": "IN_STOCK"
}
```

**Edge Case - SKU Already Exists (409 Conflict):**
```json
{
  "status": 409,
  "message": "A product with sku WM-10293 already exists"
}
```

**Edge Case - Validation Failure (400 Bad Request):**
*(e.g., Missing name or negative quantity)*
```json
{
  "status": 400,
  "message": "price must be greater than 0"
}
```

---

## 2. Update a Product

Updates an existing product's details.

**URL:** `/products`  
**Method:** `PUT`  
**Required Role:** `MANAGER`

### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Wireless Mouse v2",
  "sku": "WM-10293",
  "quantity": 100,
  "price": 34.99,
  "location": "Aisle 4, Shelf C",
  "threshold": 20
}
```

### Responses

**Success (200 OK):**
```json
{
  "name": "Wireless Mouse v2",
  "sku": "WM-10293",
  "quantity": 100,
  "price": 34.99,
  "location": "Aisle 4, Shelf C",
  "stockStatus": "IN_STOCK"
}
```

**Edge Case - Product Not Found (404 Not Found):**
```json
{
  "status": 404,
  "message": "Product not found with SKU: WM-10293"
}
```

---

## 3. Add Stock (Process Shipment)

Increases the quantity of existing products based on an incoming shipment.

**URL:** `/stock`  
**Method:** `PATCH`  
**Required Role:** `MANAGER`

### Request

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "shipmentId": "SHIP-88371",
  "supplierName": "Tech Supplies Inc.",
  "items": [
    {
      "sku": "WM-10293",
      "quantity": 50
    },
    {
      "sku": "KB-99210",
      "quantity": 100
    }
  ]
}
```

### Responses

**Success (200 OK):**
*(Empty Body)*

**Edge Case - Product Not Found (404 Not Found):**
*(If any SKU in the shipment does not exist, the transaction fails)*
```json
{
  "status": 404,
  "message": "Product not found with SKU: WM-10293"
}
```

**Edge Case - Validation Failure (400 Bad Request):**
*(e.g., negative quantity in shipment item)*
```json
{
  "status": 400,
  "message": "quantity must be greater than 0"
}
```

---

## 4. Get All Products

Retrieves a paginated list of products.

**URL:** `/products`  
**Method:** `GET`  
**Required Role:** `MANAGER`

### Request Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | integer | `0` | The page number to fetch. |
| `size` | integer | `10` | The number of records per page. |
| `stock` | string | `ALL` | Filter by stock status. Options: `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`, `ALL`. |

**Example URL:** `/products?page=0&size=20&stock=LOW_STOCK`

### Responses

**Success (200 OK):**
*(Note: Uses Spring HATEOAS PagedModel format)*
```json
{
    "content": [
      {
        "name": "Mechanical Keyboard",
        "sku": "KB-99210",
        "quantity": 5,
        "price": 89.99,
        "location": "Aisle 2",
        "stockStatus": "LOW_STOCK"
      }
    ],
    "page": {
          "size": 10,
          "number": 0,
          "totalElements": 1,
          "totalPages": 1
    }
}
```

---

## 5. Search Products

Searches for products based on a query string (returns top 5 matches).

**URL:** `/products/search`  
**Method:** `GET`  
**Required Role:** `WORKER` or `SALES`

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `query` | string | Yes | The search term to query against product names/SKUs. |

**Example URL:** `/products/search?query=Wireless`

### Responses

**Success (200 OK):**
```json
[
  {
    "name": "Wireless Mouse v2",
    "sku": "WM-10293",
    "quantity": 100,
    "price": 34.99,
    "location": "Aisle 4, Shelf C",
    "stockStatus": "IN_STOCK"
  },
  {
    "name": "Wireless Headset",
    "sku": "WH-5521",
    "quantity": 0,
    "price": 59.99,
    "location": "Aisle 1",
    "stockStatus": "OUT_OF_STOCK"
  }
]
```

---

## 6. Delete a Product

Deletes a specific product by its SKU.

**URL:** `/products/{sku}`  
**Method:** `DELETE`  
**Required Role:** `MANAGER`

### Request

**Path Variables:**
- `sku` (string): The exact SKU of the product to delete.

**Example URL:** `/products/WM-10293`

### Responses

**Success (200 OK):**
*(Empty Body)*

**Edge Case - Product Not Found (404 Not Found):**
```json
{
  "status": 404,
  "message": "Product not found with SKU: WM-10293"
}
```