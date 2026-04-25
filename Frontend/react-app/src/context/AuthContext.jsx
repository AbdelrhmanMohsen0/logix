import React from 'react';
import { TokenService, AuthAPI, UserAPI } from '../services/api';

const AuthContext = React.createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(TokenService.get());
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const saved = TokenService.get();
    if (saved) {
      (async () => {
        try {
          const u = await UserAPI.getUserMe();
          setUser(u);
          setToken(saved);
        } catch (err) {
          console.warn("Session resumed failed or token expired:", err.message);
          TokenService.remove();
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);
  const login = React.useCallback(async (email, password) => {
    const data = await AuthAPI.login(email, password);
    const jwt = data.token;
    TokenService.set(jwt);
    setToken(jwt);
    // Fetch profile from backend as specified in docs
    const u = await UserAPI.getUserMe();
    setUser(u);
    return u;
  }, []);
  const signup = React.useCallback(async (formData) => {
    const data = await AuthAPI.signup(formData);
    const jwt = data.token;
    TokenService.set(jwt);
    setToken(jwt);
    // Fetch profile from backend as specified in docs
    const u = await UserAPI.getUserMe();
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
