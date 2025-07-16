/**
 * API utilities for authentication (login, register, check, logout).
 * All functions use the axios instance with the backend URL.
 */
import { instance as axios } from '../utils/axios';

/**
 * Log in a user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
export const login = (username, password) =>
  axios.post('/auth/login', { username, password }, { withCredentials: true });

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
export const register = (username, password) =>
  axios.post('/auth/register', { username, password }, { withCredentials: true });

/**
 * Check if the user is authenticated.
 * @returns {Promise}
 */
export const checkAuth = () =>
  axios.get('/auth/check', { withCredentials: true });

/**
 * Log out the current user.
 * @returns {Promise}
 */
export const logout = () =>
  axios.post('/auth/logout', {}, { withCredentials: true }); 