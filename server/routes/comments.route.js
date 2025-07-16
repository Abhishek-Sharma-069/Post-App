// =====================================
// Comments Route - Handles all /comments API endpoints
// =====================================
const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateJWT } = require('./users.route');
const { Comment } = require('../models/comment.model');

// Create a comment (any authenticated user)
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const comment = req.body;
        comment.username = req.user.username; // Ensure username is from token
        if (!comment.PostId) {
            return res.status(400).json({ error: 'PostId is required for a comment.' });
        }
        const createdComment = await db.Comment.create(comment);
        res.status(200).json({ createdComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a comment (only by creator)
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const comment = await db.Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.username !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized to update this comment' });
        }
        const { commentBody } = req.body;
        comment.commentBody = commentBody ?? comment.commentBody;
        await comment.save();
        res.json({ message: 'Comment updated', comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a comment (only by creator)
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const comment = await db.Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.username !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }
        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await db.Comment.findAll({ where: { PostId: postId } });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;