// app/auth/page.tsx
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  ArrowRight,
  Gift,
  Star,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  agreeToTerms?: boolean;
  agreeToMarketing?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresAtUnix?: number;
  userId?: number;
}

interface UserInfo {
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

// API configuration - adjust these values based on your setup
const API_CONFIG = {
  grpcGatewayUrl:
    process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL || "http://localhost:8080",
  appId: parseInt(process.env.NEXT_PUBLIC_APP_ID || "1"),
};

class AuthService {
  private static instance: AuthService;
  private baseUrl: string;
  private appId: number;

  private constructor() {
    this.baseUrl = API_CONFIG.grpcGatewayUrl;
    this.appId = API_CONFIG.appId;
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        appId: this.appId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(`${this.baseUrl}/auth/user-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get user info");
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
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
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("tokenExpiresAt", expiresAt.toString());
    localStorage.setItem("isAuthenticated", "true");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem("tokenExpiresAt");
    if (!expiresAt) return true;
    return Date.now() / 1000 > parseInt(expiresAt);
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiresAt");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return accessToken !== null && !this.isTokenExpired();
  }
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const authService = AuthService.getInstance();

  // Password strength calculation
  useEffect(() => {
    if (!isLogin && formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[a-z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    }
  }, [formData.password, isLogin]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Registration-specific validation
    if (!isLogin) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ""))
      ) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.address?.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth = "You must be at least 18 years old";
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login with backend
        const loginResponse = await authService.login(
          formData.email,
          formData.password
        );

        if (
          loginResponse.accessToken &&
          loginResponse.refreshToken &&
          loginResponse.expiresAtUnix
        ) {
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

          // Create user object for local storage (extended with profile data)
          const user = {
            ...userInfo,
            firstName: formData.firstName || "User",
            lastName: formData.lastName || "",
            phone: formData.phone || "",
            address: formData.address || "",
            dateOfBirth: formData.dateOfBirth || "",
            membershipTier: "Basic" as const,
            tokensBalance: 50, // Default welcome bonus
            joinDate: new Date().toISOString().split("T")[0],
            totalRentals: 0,
          };

          localStorage.setItem("user", JSON.stringify(user));

          toast({
            title: "Welcome back! 🎉",
            description: `Logged in successfully. Welcome to Oiyn Shak!`,
          });

          router.push("/browse");
        }
      } else {
        // Register with backend
        const registerResponse = await authService.register(
          formData.email,
          formData.password
        );

        if (registerResponse.userId) {
          // Auto-login after registration
          const loginResponse = await authService.login(
            formData.email,
            formData.password
          );

          if (
            loginResponse.accessToken &&
            loginResponse.refreshToken &&
            loginResponse.expiresAtUnix
          ) {
            authService.setTokens(
              loginResponse.accessToken,
              loginResponse.refreshToken,
              loginResponse.expiresAtUnix
            );

            // Create new user object with registration data
            const newUser = {
              userId: registerResponse.userId,
              email: formData.email,
              firstName: formData.firstName!,
              lastName: formData.lastName!,
              phone: formData.phone!,
              address: formData.address!,
              dateOfBirth: formData.dateOfBirth!,
              membershipTier: "Basic" as const,
              tokensBalance: 50, // Welcome bonus
              joinDate: new Date().toISOString().split("T")[0],
              totalRentals: 0,
            };

            localStorage.setItem("user", JSON.stringify(newUser));

            toast({
              title: "Welcome to Oiyn Shak! 🎊",
              description:
                "Account created successfully! You've received 50 welcome tokens.",
            });

            router.push("/browse");
          }
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);

      toast({
        title: "Authentication Error",
        description:
          error.message ||
          (isLogin
            ? "Invalid email or password"
            : "Failed to create account. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login (placeholder - implement with your OAuth provider)
  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login integration would be implemented here with your OAuth setup.`,
    });
  };

  // Toggle between login and register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "" });
    setErrors({});
    setPasswordStrength(0);
  };

  // Password strength indicator helpers
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none futuristic-grid-bg" />

      <Navigation />
      <main className="flex-1 relative z-10 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Marketing content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {isLogin ? "Welcome Back!" : "Join Oiyn Shak Today!"}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {isLogin
                  ? "Continue your toy adventure with thousands of premium toys"
                  : "Discover endless fun with our premium toy rental service"}
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    150+ Premium Toys
                  </h3>
                  <p className="text-sm text-gray-600">
                    Carefully curated collection
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Top Quality</h3>
                  <p className="text-sm text-gray-600">
                    Sanitized & safety checked
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Flexible Rentals
                  </h3>
                  <p className="text-sm text-gray-600">
                    From 3 days to 1 month
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">
                    Enterprise-grade security
                  </p>
                </div>
              </div>
            </div>

            {!isLogin && (
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5" />
                  <span className="font-semibold">Welcome Bonus!</span>
                </div>
                <p className="text-sm">
                  Get 50 free tokens when you sign up today!
                </p>
              </div>
            )}
          </motion.div>

          {/* Right side - Auth form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="space-y-4 pb-6">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {isLogin ? "Sign In" : "Create Account"}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {isLogin
                      ? "Enter your credentials to access your account"
                      : "Fill in your details to get started"}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              First Name *
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="John"
                                value={formData.firstName || ""}
                                onChange={(e) =>
                                  handleInputChange("firstName", e.target.value)
                                }
                                onFocus={() => setFocusedField("firstName")}
                                onBlur={() => setFocusedField(null)}
                                className={`pl-10 ${
                                  errors.firstName
                                    ? "border-red-500"
                                    : focusedField === "firstName"
                                    ? "border-blue-500"
                                    : ""
                                }`}
                              />
                            </div>
                            {errors.firstName && (
                              <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Last Name *
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName || ""}
                                onChange={(e) =>
                                  handleInputChange("lastName", e.target.value)
                                }
                                onFocus={() => setFocusedField("lastName")}
                                onBlur={() => setFocusedField(null)}
                                className={`pl-10 ${
                                  errors.lastName
                                    ? "border-red-500"
                                    : focusedField === "lastName"
                                    ? "border-blue-500"
                                    : ""
                                }`}
                              />
                            </div>
                            {errors.lastName && (
                              <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-10 ${
                          errors.email
                            ? "border-red-500"
                            : focusedField === "email"
                            ? "border-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Phone and Address */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="tel"
                              placeholder="+7 777 123 4567"
                              value={formData.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              onFocus={() => setFocusedField("phone")}
                              onBlur={() => setFocusedField(null)}
                              className={`pl-10 ${
                                errors.phone
                                  ? "border-red-500"
                                  : focusedField === "phone"
                                  ? "border-blue-500"
                                  : ""
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Address *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Your address in Astana"
                              value={formData.address || ""}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              onFocus={() => setFocusedField("address")}
                              onBlur={() => setFocusedField(null)}
                              className={`pl-10 ${
                                errors.address
                                  ? "border-red-500"
                                  : focusedField === "address"
                                  ? "border-blue-500"
                                  : ""
                              }`}
                            />
                          </div>
                          {errors.address && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Date of Birth *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="date"
                              value={formData.dateOfBirth || ""}
                              onChange={(e) =>
                                handleInputChange("dateOfBirth", e.target.value)
                              }
                              onFocus={() => setFocusedField("dateOfBirth")}
                              onBlur={() => setFocusedField(null)}
                              className={`pl-10 ${
                                errors.dateOfBirth
                                  ? "border-red-500"
                                  : focusedField === "dateOfBirth"
                                  ? "border-blue-500"
                                  : ""
                              }`}
                            />
                          </div>
                          {errors.dateOfBirth && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.dateOfBirth}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-10 pr-10 ${
                          errors.password
                            ? "border-red-500"
                            : focusedField === "password"
                            ? "border-blue-500"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}

                    {/* Password strength indicator for registration */}
                    {!isLogin && formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Password strength:
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength <= 2
                                ? "text-red-500"
                                : passwordStrength <= 3
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              onFocus={() => setFocusedField("confirmPassword")}
                              onBlur={() => setFocusedField(null)}
                              className={`pl-10 pr-10 ${
                                errors.confirmPassword
                                  ? "border-red-500"
                                  : focusedField === "confirmPassword"
                                  ? "border-blue-500"
                                  : ""
                              }`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              id="agreeToTerms"
                              checked={formData.agreeToTerms || false}
                              onChange={(e) =>
                                handleInputChange(
                                  "agreeToTerms",
                                  e.target.checked
                                )
                              }
                              className={`mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                errors.agreeToTerms ? "border-red-500" : ""
                              }`}
                            />
                            <label
                              htmlFor="agreeToTerms"
                              className="text-sm text-gray-700"
                            >
                              I agree to the{" "}
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                Privacy Policy
                              </a>{" "}
                              *
                            </label>
                          </div>
                          {errors.agreeToTerms && (
                            <p className="text-sm text-red-500 flex items-center ml-6">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.agreeToTerms}
                            </p>
                          )}

                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              id="agreeToMarketing"
                              checked={formData.agreeToMarketing || false}
                              onChange={(e) =>
                                handleInputChange(
                                  "agreeToMarketing",
                                  e.target.checked
                                )
                              }
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor="agreeToMarketing"
                              className="text-sm text-gray-700"
                            >
                              I would like to receive marketing emails about new
                              toys, special offers, and updates
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  {/* Forgot password link for login */}
                  {isLogin && (
                    <div className="text-center">
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast({
                            title: "Password Reset",
                            description:
                              "Password reset functionality would be implemented here.",
                          });
                        }}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}

                  {/* Toggle between login and register */}
                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>

                  {/* Development info */}
                  {/* {process.env.NODE_ENV === "development" && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                      <p className="font-semibold mb-1">Development Info:</p>
                      <p>gRPC Gateway: {API_CONFIG.grpcGatewayUrl}</p>
                      <p>App ID: {API_CONFIG.appId}</p>
                      <p className="mt-2 text-blue-600">
                        Make sure your gRPC-Gateway is running and CORS is
                        properly configured
                      </p>
                    </div>
                  )} */}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
