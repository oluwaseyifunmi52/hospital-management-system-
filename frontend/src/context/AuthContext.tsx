import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthTokens, AuthState } from '../types/user';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const refreshUser = useCallback(async () => {
    const storedTokens = localStorage.getItem('auth_tokens');
    const storedUser = localStorage.getItem('auth_user');

    if (!storedTokens || !storedUser) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const tokens = JSON.parse(storedTokens);
      
      // Validate token by calling /auth/me
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

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser, setLoading, refreshUser }}>
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