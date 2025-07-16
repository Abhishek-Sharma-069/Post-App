/**
 * API utilities for comments (get, create, update, delete).
 * All functions use the axios instance with the backend URL.
 */
import { instance as axios } from '../utils/axios';

/**
 * Get all comments for a post by postId.
 * @param {number|string} postId
 * @returns {Promise}
 */
export const getCommentsByPostId = (postId) => axios.get(`/comments/${postId}`);

/**
 * Create a new comment for a post.
 * @param {string} commentBody
 * @param {number|string} PostId
 * @returns {Promise}
 */
export const createComment = (commentBody, PostId) =>
  axios.post('/comments', { commentBody, PostId }, { withCredentials: true });

/**
 * Update a comment by commentId.
 * @param {number|string} commentId
 * @param {string} commentBody
 * @returns {Promise}
 */
export const updateComment = (commentId, commentBody) =>
  axios.put(`/comments/${commentId}`, { commentBody }, { withCredentials: true });

/**
 * Delete a comment by commentId.
 * @param {number|string} commentId
 * @returns {Promise}
 */
export const deleteComment = (commentId) =>
  axios.delete(`/comments/${commentId}`, { withCredentials: true }); 