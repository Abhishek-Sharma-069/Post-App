// =====================================
// Likes Route - Handles all /likes API endpoints
// =====================================
const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateJWT } = require('./users.route');
const { Like } = require('../models/like.model');

// Like or unlike a post
router.post('/post/:postId', authenticateJWT, async (req, res) => {
    // Toggle like/unlike for a post
    const userId = req.user.id;
    const postId = req.params.postId;
    try {
        const existing = await db.Like.findOne({ where: { userId, postId } });
        if (existing) {
            await existing.destroy();
            return res.json({ liked: false });
        } else {
            await db.Like.create({ userId, postId });
            return res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like or unlike a comment
router.post('/comment/:commentId', authenticateJWT, async (req, res) => {
    // Toggle like/unlike for a comment
    const userId = req.user.id;
    const commentId = req.params.commentId;
    try {
        const existing = await db.Like.findOne({ where: { userId, commentId } });
        if (existing) {
            await existing.destroy();
            return res.json({ liked: false });
        } else {
            await db.Like.create({ userId, commentId });
            return res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get like count and user like status for a post
router.get('/post/:postId', authenticateJWT, async (req, res) => {
    // Get like count and user like status for a post
    const userId = req.user.id;
    const postId = req.params.postId;
    try {
        const count = await db.Like.count({ where: { postId } });
        const liked = await db.Like.findOne({ where: { userId, postId } }) ? true : false;
        res.json({ count, liked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get like count and user like status for a comment
router.get('/comment/:commentId', authenticateJWT, async (req, res) => {
    // Get like count and user like status for a comment
    const userId = req.user.id;
    const commentId = req.params.commentId;
    try {
        const count = await db.Like.count({ where: { commentId } });
        const liked = await db.Like.findOne({ where: { userId, commentId } }) ? true : false;
        res.json({ count, liked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 