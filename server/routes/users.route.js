// =====================================
// Users Route - Handles all /users API endpoints
// =====================================
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../models");

// REGISTER
router.post("/register", async (req, res) => {
  // Register a new user in the database
  try {
    const { username, password } = req.body;

    // 1. Validate
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // 2. Check if user exists
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await db.User.create({ username, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // Authenticate user and return token/cookie
  try {
    const { username, password } = req.body;

    // 1. Validate
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // 2. Find user
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 5. Set JWT as HTTP-only cookie (environment-aware)
    const isProduction = process.env.NODE_ENV === 'production';
    const frontendUrl = process.env.FRONTEND_URL;
    const isCrossOrigin = frontendUrl && !frontendUrl.includes('localhost');
    
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always secure for HTTPS
      sameSite: isCrossOrigin ? 'none' : 'lax', // Cross-origin only when needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/'
    };
    
    // Don't set domain for cross-origin - let browser handle it
    console.log('Login - Frontend URL:', frontendUrl);
    console.log('Login - Is cross-origin:', isCrossOrigin);
    
    console.log('Login - Setting cookie with options:', cookieOptions);
    res.cookie('token', token, cookieOptions);

    // 6. Success response (no token in body)
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// AUTH CHECK
router.get("/check", (req, res) => {
  console.log('Auth check - Cookies received:', req.cookies);
  console.log('Auth check - Headers:', req.headers.cookie);
  
  const token = req.cookies.token;
  if (!token) {
    console.log('Auth check - No token found');
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  console.log('Auth check - Token found:', token.substring(0, 20) + '...');
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Auth check - Token valid, user:', decoded);
    res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    console.log('Auth check - Token invalid:', err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// AUTH LOGOUT
router.post("/logout", (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL;
  const isCrossOrigin = frontendUrl && !frontendUrl.includes('localhost');
  
  const clearCookieOptions = {
    httpOnly: true,
    secure: true, // Always secure for HTTPS
    sameSite: isCrossOrigin ? 'none' : 'lax', // Cross-origin only when needed
    path: '/'
  };
  
  res.clearCookie('token', clearCookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
});

// JWT Auth Middleware (exported separately for use in other routes)
function authenticateJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = router;
module.exports.authenticateJWT = authenticateJWT;