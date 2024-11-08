import React, { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const url = new URL("http://localhost:5000/api/Authentication/Login");
      url.searchParams.append("email", email);
      url.searchParams.append("password", password);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Failed to login", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const url = new URL("http://localhost:5000/api/Authentication/Register");
      url.searchParams.append("email", email);
      url.searchParams.append("password", password);
      url.searchParams.append("fullName", fullName);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Failed to register", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
