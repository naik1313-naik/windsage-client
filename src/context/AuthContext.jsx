/**
 * Authentication context for WindSage AI.
 *
 * Client-side session backed by localStorage so the app runs standalone with
 * `npm run dev` (no backend required). `logout()` never throws to the UI — any
 * error is caught and the local session is cleared anyway, so clicking log out
 * always succeeds and never shows an error.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const AUTH_KEY = 'windsage.user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | anonymous
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Rehydrate an existing session from localStorage.
  useEffect(() => {
    let cancelled = false;
    async function rehydrate() {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) {
          setStatus('anonymous');
          return;
        }
        const parsed = JSON.parse(raw);
        if (cancelled) return;
        setUser(parsed.user || parsed);
        setStatus('authenticated');
      } catch {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
        setStatus('anonymous');
      }
    }
    rehydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback((payload) => {
    const toStore = payload.user ? payload : { user: payload };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(toStore));
    } catch {
      /* private mode — session won't persist */
    }
    setUser(toStore.user || toStore);
    setStatus('authenticated');
    setError(null);
  }, []);

  const login = useCallback((credentials) => {
    setError(null);
    // Standalone demo: accept any non-empty email/password.
    if (!credentials.email || !credentials.password) {
      const err = new Error('Enter your email and password.');
      setError(err.message);
      throw err;
    }
    const payload = {
      user: {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'OPERATOR',
      },
    };
    applySession(payload);
    return payload.user;
  }, [applySession]);

  // Logout never throws to the UI — catches everything and clears session anyway.
  const logout = useCallback(async () => {
    setError(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* no-op */
    }
    if (mounted.current) {
      setUser(null);
      setStatus('anonymous');
      setError(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      setError,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      logout,
    }),
    [user, status, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}

export default AuthContext;
