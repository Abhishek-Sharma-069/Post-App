/**
 * Custom React hook to check user authentication status.
 * Fetches /auth/check and returns { auth, loading, user }.
 * Usage: const { auth, loading, user } = useAuthCheck();
 */
import { useEffect, useState, useCallback } from 'react';
import { instance as axios } from '../utils/axios';

export default function useAuthCheck() {
  // State for authentication status, loading, and user info
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get('/auth/check', { withCredentials: true });
      setAuth(true);
      setUser(res.data.user || null);
      setLoading(false);
    } catch (error) {
      setAuth(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Return auth status, loading state, user info, and refresh function
  return { auth, loading, user, refreshAuth: checkAuth };
} 