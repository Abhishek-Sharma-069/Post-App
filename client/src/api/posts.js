/**
 * API utilities for posts (get, create, update, delete, pagination).
 * All functions use the axios instance with the backend URL.
 */
import { instance as axios } from '../utils/axios';

/**
 * Get all posts with pagination.
 * @param {number} page - Page number (default 1)
 * @param {number} limit - Posts per page (default 10)
 * @returns {Promise}
 */
export const getAllPosts = (page = 1, limit = 10) => axios.get(`/posts?page=${page}&limit=${limit}`);

/**
 * Get a single post by its ID.
 * @param {number|string} id - Post ID
 * @returns {Promise}
 */
export const getPostById = (id) => axios.get(`/posts/byId/${id}`);

/**
 * Get posts by username with pagination.
 * @param {string} username
 * @param {number} page
 * @param {number} limit
 * @returns {Promise}
 */
export const getPostsByUsername = (username, page = 1, limit = 10) => axios.get(`/posts?username=${username}&page=${page}&limit=${limit}`);

/**
 * Create a new post (with optional image).
 * @param {FormData} formData
 * @returns {Promise}
 */
export const createPost = (formData) => axios.post('/posts/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 5000,
  withCredentials: true,
});

/**
 * Update a post by ID.
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise}
 */
export const updatePost = (id, data) => axios.put(`/posts/${id}`, data, { withCredentials: true });

/**
 * Delete a post by ID.
 * @param {number|string} id
 * @returns {Promise}
 */
export const deletePost = (id) => axios.delete(`/posts/${id}`, { withCredentials: true }); 