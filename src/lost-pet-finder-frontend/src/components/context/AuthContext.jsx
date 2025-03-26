import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      await client.logout();  
      setAuthClient(client);
      setIsAuthenticated(false);
    };
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      maxTimeToLive: BigInt(5 * 60 * 1_000_000_000), // 5 minutes
      onSuccess: async () => {
        setIsAuthenticated(await authClient.isAuthenticated());
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authClient }}>
      {children}
    </AuthContext.Provider>
  );
};
