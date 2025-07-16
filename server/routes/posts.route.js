// =====================================
// Posts Route - Handles all /posts API endpoints
// =====================================
const express = require('express');
const db = require('../models');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticateJWT } = require('./users.route');

// Example: GET /posts - Get all posts
router.get('/', async (req, res) => {
    try {
        const { username } = req.query;
        let listOfPosts;
        if (username) {
            listOfPosts = await db.Post.findAll({ where: { username } });
        } else {
            listOfPosts = await db.Post.findAll();
        }
        res.status(200).json({
            message: "Posts retrieved successfully",
            listOfPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            error: "Failed to fetch posts",
            details: error.message 
        });
    }
});

// Example: POST /posts - Create a new post
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);

        // Validate required fields
        if (!req.body.title || !req.body.postText) {
            return res.status(400).json({
                error: "Missing required fields",
                details: "Title and post text are required"
            });
        }

        const postData = {
            title: req.body.title,
            postText: req.body.postText,
            username: req.user.username,
            imageUrl: req.file ? `/upload/${req.file.filename}` : null
        };

        console.log('Creating post with data:', postData);

        const created = await db.Post.create(postData);
        
        console.log('Post created successfully:', created);

        res.status(200).json({
            message: 'Post created successfully',
            data: created
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            error: "Failed to create post",
            details: error.message
        });
    }
});

router.post('/createpost', async (req, res) => {
    try {
        const post = req.body;
        const created = await db.Post.create(post);
        res.status(200).json({
            message: 'Post created successfully',
            data: created
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/byId/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await db.Post.findByPk(id);
        console.log(post);
        res.status(200).json({message:`It is the post of ID ${id}.`, post });
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
});

// Update a post (only by creator)
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await db.Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.username !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }
        const { title, postText, imageUrl } = req.body;
        post.title = title ?? post.title;
        post.postText = postText ?? post.postText;
        post.imageUrl = imageUrl ?? post.imageUrl;
        await post.save();
        res.json({ message: 'Post updated', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post (only by creator)
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await db.Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.username !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }
        await post.destroy();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;