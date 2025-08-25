# Plant Nursery E-Commerce Backend

A complete and scalable backend for a full-stack e-commerce application, built with Node.js, Express, and MongoDB.

This project provides a comprehensive RESTful API to handle all core e-commerce functionalities, including user authentication with role-based access, full product catalog management, and a complete order processing system.



## Core Features

*   **Secure Authentication & Authorization:** Implements stateless authentication using JSON Web Tokens (JWT). Passwords are encrypted with `bcryptjs`. Custom middleware protects sensitive endpoints and differentiates between `customer` and `admin` roles.
*   **Full Product Management (CRUD):** Provides a full suite of admin-only endpoints to Create, Read, Update, and Delete product categories and individual plant listings.
*   **Complete Order Lifecycle:** Enables customers to create orders and view their history. The API is designed to support admin management and status updates for all orders.
*   **Robust Data Modeling:** Features a well-designed MongoDB schema using Mongoose. It leverages referencing for data relationships and embedding for transactional integrity (e.g., price snapshots in orders) to ensure data is reliable and scalable.
*   **Professional Project Structure:** Organized into a clean, modular architecture (routes, models, middleware, services) for maintainability and ease of extension.



## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT), bcrypt.js
*   **API Testing:** Postman



## API Endpoints Summary

The API provides a full suite of endpoints for managing users, products, and orders.

*   **Authentication (`/api/users`):** `POST /register`, `POST /login`, `GET /profile` (Private)
*   **Categories (`/api/categories`):** Full CRUD endpoints for managing categories (`GET`, `POST`, `PUT`, `DELETE`). `POST`, `PUT`, and `DELETE` are admin-only.
*   **Plants (`/api/plants`):** Full CRUD endpoints for managing plants. `POST`, `PUT`, and `DELETE` are admin-only.
*   **Orders (`/api/orders`):** Endpoints for creating orders and viewing order history. All are private and user-specific.


## Contact 
Afshan Qasim - - qasimafshan89@gmail.com
