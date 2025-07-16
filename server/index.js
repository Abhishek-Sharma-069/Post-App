require('dotenv').config();
// ===============================
// HeyEV Backend - Main Entry Point
// This file sets up the Express server, connects to the database,
// configures middleware, and mounts all API routes.
// ===============================

// Import required modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require('./models'); // Sequelize instance for DB

// Import route handlers
const postsRouter = require('./routes/posts.route');
const usersRouter = require('./routes/users.route');
const { authenticateJWT } = require('./routes/users.route');
const commentsRouter = require('./routes/comments.route');
const likesRouter = require('./routes/likes.route');

// Create Express app
const app = express();

// ===============================
// Middleware
// ===============================
// Enable CORS for frontend (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies
}));
// Parse JSON request bodies
app.use(express.json());
// Parse cookies
app.use(cookieParser());
// Serve uploaded images statically
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// ===============================
// API Routes
// ===============================
// Mount route handlers for posts, users, and comments
app.use('/posts', postsRouter);
app.use('/auth', usersRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);

// ===============================
// Start the server and connect to DB
// ===============================
const PORT = process.env.PORT || 3000;

// Sync Sequelize models and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
