# LogiX

A cloud-native logistics and warehouse operations platform that helps businesses track their products from the moment they arrive at a warehouse until they are shipped to a customer.

## Architecture

LogiX is built using a microservices architecture. The system consists of the following services:

- **Auth Service**: Handles user authentication and authorization using JWT.
- **Order Service**: Manages customer orders and their lifecycles.
- **Inventory Service**: Tracks product stock, allocations, and shipments.
- **Warehouse Service**: Manages warehouse operations.
- **Frontend**: A React application built with Vite to interact with the backend services.

The services communicate asynchronously via an event-driven architecture using **AWS SNS/SQS**.

## Tech Stack

- **Backend Framework**: Spring Boot 4 (Java 25)
- **Database**: PostgreSQL
- **Frontend**: React, Vite
- **Messaging/Events**: Spring Cloud AWS (AWS SNS & SQS)
- **Security**: Spring Security (JWT)
- **Containerization**: Docker, Docker Compose

## Prerequisites

Before running the project locally, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine and Docker Compose
- [Java 25](https://jdk.java.net/25/) (If running without Docker)
- [Node.js](https://nodejs.org/) and npm (If running frontend outside Docker)

## Environment Configuration

A `.env.example` file is provided in the root directory. Create a `.env` file from it:

```sh
cp .env.example .env
```

Ensure you configure all necessary variables in the `.env` file, especially the database credentials, JWT secret, and AWS configuration.

## Running Locally

To run the entire application stack using Docker Compose:

1. Open a terminal in the root directory.
2. Run the following command:

```sh
docker-compose up --build
```

This will spin up all the backend services along with their respective PostgreSQL databases.

### Service Ports

> **Note:** The following port configuration is **only for local development**. When deployed, all services are accessed through a single base URL provided by the Application Load Balancer (ALB) (e.g., `http://logix-alb-1374867690.eu-central-1.elb.amazonaws.com`).

When running locally via Docker Compose, the services are mapped to the following ports:

- **Auth Service**: `http://localhost:8081`
- **Order Service**: `http://localhost:8082`
- **Inventory Service**: `http://localhost:8083`
- **Warehouse Service**: `http://localhost:8084`

### Running the Frontend

Navigate to the `frontend` directory:

```sh
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.