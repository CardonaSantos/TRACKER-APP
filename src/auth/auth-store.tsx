import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "auth-storage";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setUser(parsed.user);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const setAuth = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: newToken, user: newUser }),
    );
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
