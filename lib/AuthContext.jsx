import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthStore } from "./auth";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await AuthStore.init();
      const current = await AuthStore.getCurrentUser();
      setUser(current);
      setIsLoading(false);
    })();
  }, []);

  const signup = useCallback(async (payload) => {
    const newUser = await AuthStore.signup(payload);
    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback(async (payload) => {
    const loggedInUser = await AuthStore.login(payload);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await AuthStore.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === "admin",
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
