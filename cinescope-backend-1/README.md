# CineScope Backend

CineScope is a movie management application that allows users to register, log in, and explore a variety of movies. The backend is built using Node.js, Express, and MongoDB.

## Features

- User registration and authentication
- Fetch popular movies from an external API
- Search for movies by title
- Retrieve detailed information about specific movies

## Project Structure

```
cinescope-backend
├── controllers
│   ├── authController.js      # Handles user registration and login
│   └── movieController.js      # Manages movie-related operations
├── middlewares
│   ├── authMiddleware.js       # Middleware for JWT authentication
│   └── errorHandler.js         # Centralized error handling
├── models                       # Mongoose models (currently empty)
├── routes
│   ├── authRoutes.js           # Routes for authentication
│   └── movieRoutes.js          # Routes for movie operations
├── utils
│   ├── db.js                   # Database connection utility
│   └── test-db.js              # Script to test MongoDB connection
├── .env                         # Environment variables
├── package.json                 # NPM package configuration
├── server.js                    # Entry point of the application
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cinescope-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` file to `.env` and fill in the required values:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   TMDB_API_KEY=<your-tmdb-api-key>
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

5. **Test the MongoDB connection:**
   You can run the test script to verify the MongoDB connection:
   ```bash
   node utils/test-db.js
   ```

## Usage

- Access the API endpoints for user authentication and movie operations as defined in the routes.
- Use tools like Postman or curl to interact with the API.

## License

This project is licensed under the MIT License.