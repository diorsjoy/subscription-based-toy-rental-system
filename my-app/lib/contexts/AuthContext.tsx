// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  membershipTier?: "Basic" | "Premium" | "VIP";
  tokensBalance?: number;
  joinDate?: string;
  totalRentals?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Service
class AuthService {
  private static instance: AuthService;
  private baseUrl: string;
  private appId: number;

  private constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL || "http://localhost:8080";
    this.appId = parseInt(process.env.NEXT_PUBLIC_APP_ID || "1");
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(email: string, password: string): Promise<{ userId: number }> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAtUnix: number;
  }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, appId: this.appId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  }

  async getUserInfo(
    accessToken: string
  ): Promise<{ userId: number; email: string }> {
    const response = await fetch(`${this.baseUrl}/auth/user-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get user info");
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAtUnix: number;
  }> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token refresh failed");
    }

    return response.json();
  }

  async logout(refreshToken: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    const result = await response.json();
    return result.success;
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string, expiresAt: number) {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenExpiresAt", expiresAt.toString());
      localStorage.setItem("isAuthenticated", "true");
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  isTokenExpired(): boolean {
    if (typeof window !== "undefined") {
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      if (!expiresAt) return true;
      return Date.now() / 1000 > parseInt(expiresAt);
    }
    return true;
  }

  clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return accessToken !== null && !this.isTokenExpired();
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const authService = AuthService.getInstance();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const isAuth = authService.isAuthenticated();

        if (isAuth && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          // Try to refresh token if it's about to expire
          const accessToken = authService.getAccessToken();
          if (accessToken && authService.isTokenExpired()) {
            await refreshToken();
          }
        } else {
          // Clear invalid auth state
          authService.clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      authService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const loginResponse = await authService.login(email, password);

      if (loginResponse.accessToken && loginResponse.refreshToken) {
        // Store tokens
        authService.setTokens(
          loginResponse.accessToken,
          loginResponse.refreshToken,
          loginResponse.expiresAtUnix
        );

        // Get user info
        const userInfo = await authService.getUserInfo(
          loginResponse.accessToken
        );

        // Create user object
        const userData: User = {
          userId: userInfo.userId,
          email: userInfo.email,
          // membershipTier: "Basic",
          // tokensBalance: 50,
          joinDate: new Date().toISOString().split("T")[0],
          totalRentals: 0,
        };

        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
        setIsAuthenticated(true);

        toast({
          title: "Welcome back! 🎉",
          description: "Logged in successfully.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);

      // Register user
      const registerResponse = await authService.register(
        userData.email,
        userData.password
      );

      if (registerResponse.userId) {
        // Auto-login after registration
        const loginResponse = await authService.login(
          userData.email,
          userData.password
        );

        if (loginResponse.accessToken && loginResponse.refreshToken) {
          authService.setTokens(
            loginResponse.accessToken,
            loginResponse.refreshToken,
            loginResponse.expiresAtUnix
          );

          // Create new user object with registration data
          const newUser: User = {
            userId: registerResponse.userId,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            address: userData.address,
            dateOfBirth: userData.dateOfBirth,
            membershipTier: "Basic",
            tokensBalance: 50, // Welcome bonus
            joinDate: new Date().toISOString().split("T")[0],
            totalRentals: 0,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(newUser));
          }
          setUser(newUser);
          setIsAuthenticated(true);

          toast({
            title: "Welcome to ToyRent! 🎊",
            description:
              "Account created successfully! You've received 50 welcome tokens.",
          });
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const refreshTokenStr = authService.getRefreshToken();

      if (refreshTokenStr) {
        try {
          await authService.logout(refreshTokenStr);
        } catch (error) {
          // Even if logout fails on backend, clear local state
          console.error("Backend logout error:", error);
        }
      }

      // Clear local state
      authService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenStr = authService.getRefreshToken();
      if (!refreshTokenStr) return false;

      const response = await authService.refreshToken(refreshTokenStr);

      if (response.accessToken && response.refreshToken) {
        authService.setTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresAtUnix
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout user
      await logout();
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  // Auto-refresh token before it expires
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (isAuthenticated && !isLoading) {
      refreshInterval = setInterval(async () => {
        const accessToken = authService.getAccessToken();
        if (accessToken && authService.isTokenExpired()) {
          await refreshToken();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated, isLoading]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/auth");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
