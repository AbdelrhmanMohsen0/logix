# Auth Service API Documentation

This document provides API details, request/response examples, and edge case scenarios for the Auth and User services. All secured endpoints require a JWT token in the `Authorization` header (`Bearer <token>`).

---

## Standard Error Response Format

All errors returned by the API follow this standardized structure:

```json
{
  "status": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific validation message"
    }
  ]
}
```
*Note: The `errors` array is only present for payload validation (`400 Bad Request`) errors.*

---

## 1. Authentication Endpoints

### 1.1. Login
Authenticates a user and returns a JWT token.

* **URL:** `/login`
* **Method:** `POST`
* **Auth Required:** No

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Edge Cases:**
* **401 Unauthorized (Invalid Credentials):**
  ```json
  {
    "status": 401,
    "message": "Incorrect email or password",
    "errors": null
  }
  ```
* **400 Bad Request (Validation Error):**
  ```json
  {
    "status": 400,
    "message": "The server cannot process the request due to client error",
    "errors": [
      { "field": "email", "message": "Email is required" }
    ]
  }
  ```

---

### 1.2. Organization Signup
Creates a new organization and its initial Owner account. Automatically logs the user in and returns a token upon success.

* **URL:** `/signup`
* **Method:** `POST`
* **Auth Required:** No

**Request Body:**
```json
{
  "organizationName": "Acme Corp",
  "email": "owner@acmecorp.com",
  "adminName": "Jane Doe",
  "password": "superSecurePassword!"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Edge Cases:**
* **400 Bad Request (Validation Errors):**
  ```json
  {
    "status": 400,
    "message": "The server cannot process the request due to client error",
    "errors": [
      { "field": "password", "message": "Password must be between 8 and 30 characters" },
      { "field": "email", "message": "UniqueEmailAddress" } 
    ]
  }
  ```

---

## 2. User Endpoints

### 2.1. Get Current User
Retrieves the profile of the currently authenticated user based on the JWT token.

* **URL:** `/users/me`
* **Method:** `GET`
* **Auth Required:** Yes (Valid Token)

**Success Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "owner@acmecorp.com",
  "name": "Jane Doe",
  "role": "ROLE_OWNER"
}
```

**Edge Cases:**
* **404 Not Found (User deleted but token still active):**
  ```json
  {
    "status": 404,
    "message": "User not found with id: 123e4567-e89b-12d3-a456-426614174000",
    "errors": null
  }
  ```

---

### 2.2. Create User
Adds a new user to the organization associated with the requester.

* **URL:** `/users`
* **Method:** `POST`
* **Auth Required:** Yes (`ROLE_ADMIN` or `ROLE_OWNER`)

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@acmecorp.com",
  "password": "password123",
  "role": "ROLE_ADMIN"
}
```

**Success Response (201 Created):**
*Headers:* `Location: /users/550e8400-e29b-41d4-a716-446655440000`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.smith@acmecorp.com",
  "name": "John Smith",
  "role": "ROLE_ADMIN"
}
```

**Edge Cases:**
* **403 Forbidden (Admin attempting to create an Owner account):**
  ```json
  {
    "status": 403,
    "message": "Admins cannot create Owner accounts.",
    "errors": null
  }
  ```
* **403 Forbidden (Insufficient credentials):** Returned if a standard user tries to access this endpoint.

---

### 2.3. Get All Users
Retrieves all users belonging to the requester's organization.

* **URL:** `/users`
* **Method:** `GET`
* **Auth Required:** Yes (`ROLE_ADMIN` or `ROLE_OWNER`)

**Success Response (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "owner@acmecorp.com",
    "name": "Jane Doe",
    "role": "ROLE_OWNER"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.smith@acmecorp.com",
    "name": "John Smith",
    "role": "ROLE_ADMIN"
  }
]
```

---

### 2.4. Get User by ID
Retrieves a specific user by their UUID. The user must belong to the same organization as the requester.

* **URL:** `/users/{id}`
* **Method:** `GET`
* **Auth Required:** Yes (`ROLE_ADMIN` or `ROLE_OWNER`)

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.smith@acmecorp.com",
  "name": "John Smith",
  "role": "ROLE_ADMIN"
}
```

**Edge Cases:**
* **404 Not Found (User does not exist or belongs to another organization):**
  ```json
  {
    "status": 404,
    "message": "User not found with id: 550e8400-e29b-41d4-a716-446655440000",
    "errors": null
  }
  ```

---

### 2.5. Update User
Updates an existing user's details.

* **URL:** `/users/{id}`
* **Method:** `PUT`
* **Auth Required:** Yes (`ROLE_ADMIN` or `ROLE_OWNER`)

**Request Body:**
```json
{
  "name": "Johnathan Smith",
  "email": "john.smith@acmecorp.com",
  "password": "newPassword123",
  "role": "ROLE_ADMIN"
}
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.smith@acmecorp.com",
  "name": "Johnathan Smith",
  "role": "ROLE_ADMIN"
}
```

**Edge Cases:**
* **409 Conflict (Email belongs to another user):**
  ```json
  {
    "status": 409,
    "message": "Email already exists",
    "errors": null
  }
  ```
* **403 Forbidden (Admin updating an Owner account):**
  ```json
  {
    "status": 403,
    "message": "Only Owners can update Owner accounts.",
    "errors": null
  }
  ```
* **403 Forbidden (Admin promoting an account to Owner):**
  ```json
  {
    "status": 403,
    "message": "Only Owners can set account roles to OWNER.",
    "errors": null
  }
  ```

---

### 2.6. Delete User
Deletes a specific user from the organization.

* **URL:** `/users/{id}`
* **Method:** `DELETE`
* **Auth Required:** Yes (`ROLE_ADMIN` or `ROLE_OWNER`)

**Success Response:**
* **Code:** 204 No Content
* **Body:** *Empty*

**Edge Cases:**
* **403 Forbidden (Attempting to delete an Owner):**
  ```json
  {
    "status": 403,
    "message": "Owner accounts can't be deleted.",
    "errors": null
  }
  ```
* **404 Not Found (User doesn't exist/wrong organization):**
  ```json
  {
    "status": 404,
    "message": "User not found with id: 550e8400-e29b-41d4-a716-446655440000",
    "errors": null
  }
  ```