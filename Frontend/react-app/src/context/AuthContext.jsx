import React from 'react';
import { TokenService, AuthAPI, parseJwt } from '../services/api';

const AuthContext = React.createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(TokenService.get());
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const saved = TokenService.get();
    if (saved) {
      const payload = parseJwt(saved);
      if (payload) {
        setUser({
          email: payload.sub || payload.email || "user@logix.io",
          name: payload.name || payload.sub || "LogiX User",
          role: payload.role || "ROLE_ADMIN",
        });
        setToken(saved);
      } else {
        TokenService.remove();
      }
    }
    setLoading(false);
  }, []);
  const login = React.useCallback(async (email, password) => {
    const data = await AuthAPI.login(email, password);
    const jwt = data.token;
    TokenService.set(jwt);
    const payload = parseJwt(jwt);
    const u = {
      email: payload?.sub || email,
      name: payload?.name || email.split("@")[0],
      role: payload?.role || "ROLE_ADMIN",
    };
    setToken(jwt);
    setUser(u);
    return u;
  }, []);
  const signup = React.useCallback(async (formData) => {
    const data = await AuthAPI.signup(formData);
    const jwt = data.token;
    TokenService.set(jwt);
    const payload = parseJwt(jwt);
    const u = {
      email: payload?.sub || formData.email,
      name: payload?.name || formData.adminName,
      role: payload?.role || "ROLE_OWNER",
    };
    setToken(jwt);
    setUser(u);
    return u;
  }, []);
  const logout = React.useCallback(() => {
    TokenService.remove();
    setToken(null);
    setUser(null);
  }, []);
  const isAuthenticated = !!token && !!user;
  const value = React.useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [user, token, loading, isAuthenticated, login, signup, logout],
  );
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
