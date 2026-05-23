import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from './authService.js';
import { clearAccessToken, getAccessToken, setAccessToken } from './authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const applySession = useCallback((session) => {
    setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  useEffect(() => {
    async function bootstrapSession() {
      try {
        if (getAccessToken()) {
          const currentUser = await authService.me();
          setUser(currentUser);
          return;
        }

        const session = await authService.refresh();
        applySession(session);
      } catch (_error) {
        clearSession();
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrapSession();
  }, [applySession, clearSession]);

  const login = useCallback(
    async (payload) => {
      const session = await authService.login(payload);
      applySession(session);
      return session;
    },
    [applySession],
  );

  const register = useCallback(
    async (payload) => {
      const session = await authService.register(payload);
      applySession(session);
      return session;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await authService.logout();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      register,
      logout,
      updateUser: setUser,
      clearSession,
    }),
    [clearSession, isBootstrapping, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
