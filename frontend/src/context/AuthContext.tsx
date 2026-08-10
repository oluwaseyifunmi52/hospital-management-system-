import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthTokens, AuthState } from '../types/user';
import { authService } from '../services/auth.service';
import { isTokenExpired } from '../utils/token';

interface AuthContextType extends AuthState {
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
  updateTokens: (tokens: AuthTokens) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredAuth(): { tokens: AuthTokens | null; user: User | null } {
  const storedTokens = localStorage.getItem('auth_tokens');
  const storedUser = localStorage.getItem('auth_user');

  let tokens: AuthTokens | null = null;
  let user: User | null = null;

  if (storedTokens) {
    try {
      tokens = JSON.parse(storedTokens);
    } catch {
      localStorage.removeItem('auth_tokens');
    }
  }

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('auth_user');
    }
  }

  return { tokens, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { tokens, user } = getStoredAuth();
  const initialLoading = !!(tokens && user);

  const [state, setState] = useState<AuthState>({
    user,
    tokens,
    isAuthenticated: !!(tokens && user && !isTokenExpired(tokens.accessToken)),
    isLoading: initialLoading,
    error: null,
  });

  const refreshUser = useCallback(async () => {
    const storedTokens = localStorage.getItem('auth_tokens');
    const storedUser = localStorage.getItem('auth_user');

    if (!storedTokens || !storedUser) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, tokens: null }));
      return;
    }

    try {
      const tokens = JSON.parse(storedTokens);

      if (isTokenExpired(tokens.accessToken)) {
        throw new Error('Token expired');
      }

      const freshUser = await authService.getMe();

      localStorage.setItem('auth_user', JSON.stringify(freshUser));
      setState({
        user: freshUser,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please login again.',
      });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (tokens: AuthTokens, user: User) => {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    localStorage.setItem('auth_user', JSON.stringify(user));
    setState({
      user,
      tokens,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const setUser = (user: User) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const updateTokens = (tokens: AuthTokens) => {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    setState(prev => ({ ...prev, tokens }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser, setLoading, refreshUser, updateTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}