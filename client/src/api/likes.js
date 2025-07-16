/**
 * API utilities for likes (posts and comments).
 * All functions use the axios instance with the backend URL.
 */
import { instance as axios } from '../utils/axios';

/**
 * Get like count and status for a post.
 * @param {number|string} postId
 * @returns {Promise}
 */
export const getPostLikes = (postId) =>
  axios.get(`/likes/post/${postId}`, { withCredentials: true });

/**
 * Toggle like/unlike for a post.
 * @param {number|string} postId
 * @returns {Promise}
 */
export const togglePostLike = (postId) =>
  axios.post(`/likes/post/${postId}`, {}, { withCredentials: true });

/**
 * Get like count and status for a comment.
 * @param {number|string} commentId
 * @returns {Promise}
 */
export const getCommentLikes = (commentId) =>
  axios.get(`/likes/comment/${commentId}`, { withCredentials: true });

/**
 * Toggle like/unlike for a comment.
 * @param {number|string} commentId
 * @returns {Promise}
 */
export const toggleCommentLike = (commentId) =>
  axios.post(`/likes/comment/${commentId}`, {}, { withCredentials: true }); 