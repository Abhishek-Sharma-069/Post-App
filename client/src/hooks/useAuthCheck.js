/**
 * Custom React hook to check user authentication status.
 * Fetches /auth/check and returns { auth, loading, user }.
 * Usage: const { auth, loading, user } = useAuthCheck();
 */
import { useEffect, useState } from 'react';
import { instance as axios } from '../utils/axios';

export default function useAuthCheck() {
  // State for authentication status, loading, and user info
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Check authentication by calling /auth/check
    axios.get('/auth/check', { withCredentials: true })
      .then(res => {
        if (isMounted) {
          setAuth(true);
          setUser(res.data.user || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuth(false);
          setUser(null);
          setLoading(false);
        }
      });
    // Cleanup to avoid setting state on unmounted component
    return () => { isMounted = false; };
  }, []);

  // Return auth status, loading state, and user info
  return { auth, loading, user };
} 