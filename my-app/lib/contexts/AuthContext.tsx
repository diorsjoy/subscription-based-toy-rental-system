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
  permissions?: number; // Add this line - 2 for admin, 1 for user
  role?: "admin" | "user"; // Alternative approach if you prefer string roles
}

// 2. Update AuthContextType interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: () => boolean; // Add this line
  hasPermission: (permissionLevel: number) => boolean; // Add this line
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

  async getUserInfo(accessToken: string): Promise<{
    userId: number;
    email: string;
    permissions?: number;
    role?: string;
  }> {
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

  isUserAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.permissions === 2 || user.role === "admin";
  }

  // Helper method to check permissions
  userHasPermission(user: User | null, permissionLevel: number): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions >= permissionLevel;
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

        // Get user info with permissions
        const userInfo = await authService.getUserInfo(
          loginResponse.accessToken
        );

        // Create user object with permissions
        const userData: User = {
          userId: userInfo.userId,
          email: userInfo.email,
          permissions: userInfo.permissions, // Include permissions from API
          role: userInfo.role, // Include role if using string-based roles
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

          // Get user info with permissions
          const userInfo = await authService.getUserInfo(
            loginResponse.accessToken
          );

          // Create new user object with registration data and permissions
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
            permissions: userInfo.permissions || 1, // Default to regular user
            role: userInfo.role || "user",
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

  const isAdmin = (): boolean => {
    return authService.isUserAdmin(user);
  };

  // Permission check function
  const hasPermission = (permissionLevel: number): boolean => {
    return authService.userHasPermission(user, permissionLevel);
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
    isAdmin,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const adminService = {
  // Check if current user is admin
  isCurrentUserAdmin: (): boolean => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        return user.permissions === 2 || user.role === "admin";
      }
    }
    return false;
  },

  // Get admin dashboard data
  getDashboardData: async (): Promise<any> => {
    const response = await fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin dashboard data");
    }

    return response.json();
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  },

  // Update user permissions (admin only)
  updateUserPermissions: async (
    userId: number,
    permissions: number
  ): Promise<boolean> => {
    const response = await fetch(`/api/admin/users/${userId}/permissions`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user permissions");
    }

    return true;
  },
};

export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return function AdminAuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push("/auth");
        } else if (!isAdmin()) {
          router.push("/"); // Redirect non-admin users to home
        }
      }
    }, [isAuthenticated, isLoading, isAdmin, router]);

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

    if (!isAuthenticated || !isAdmin()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have admin privileges to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// 7. Admin Route Component
export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else if (!isAdmin()) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router]);

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

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return <>{children}</>;
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
