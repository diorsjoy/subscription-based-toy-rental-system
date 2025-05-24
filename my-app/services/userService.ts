// services/userService.ts
import { apiService } from "@/api/index";
import { AxiosResponse } from "axios";

const USER_ENDPOINT = "/users";

// Types for better TypeScript support
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: Address;
  membershipTier: "bronze" | "silver" | "gold" | "platinum";
  joinDate: string;
  isActive: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: Partial<Address>;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface RentalHistory {
  id: string;
  toyId: number;
  toyName: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  totalCost: number;
  rating?: number;
  review?: string;
}

interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: "en" | "ru" | "kk";
  currency: "KZT" | "USD";
  autoRenewal: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const userService = {
  // Get user profile
  getProfile: (): Promise<AxiosResponse<ApiResponse<UserProfile>>> =>
    apiService.get(`${USER_ENDPOINT}/profile`),

  // Update user profile
  updateProfile: (
    profileData: UpdateProfileData
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> =>
    apiService.put(`${USER_ENDPOINT}/profile`, profileData),

  // Change password
  changePassword: (
    passwordData: PasswordChangeData
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    apiService.post(`${USER_ENDPOINT}/change-password`, passwordData),

  // Get user rental history
  getRentalHistory: (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<
    AxiosResponse<
      ApiResponse<{ rentals: RentalHistory[]; total: number; pages: number }>
    >
  > => {
    let queryParams = `page=${page}&limit=${limit}`;
    if (status) queryParams += `&status=${status}`;

    return apiService.get(`${USER_ENDPOINT}/rental-history?${queryParams}`);
  },

  // Get user preferences
  getPreferences: (): Promise<AxiosResponse<ApiResponse<UserPreferences>>> =>
    apiService.get(`${USER_ENDPOINT}/preferences`),

  // Update user preferences
  updatePreferences: (
    preferences: Partial<UserPreferences>
  ): Promise<AxiosResponse<ApiResponse<UserPreferences>>> =>
    apiService.put(`${USER_ENDPOINT}/preferences`, preferences),

  // Delete user account
  deleteAccount: (
    password: string,
    reason?: string
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    apiService.delete(`${USER_ENDPOINT}/account`, {
      data: { password, reason },
    }),

  // Upload profile picture
  uploadProfilePicture: (
    file: File
  ): Promise<AxiosResponse<ApiResponse<{ imageUrl: string }>>> => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    return apiService.post(`${USER_ENDPOINT}/profile-picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get user statistics
  getStatistics: (): Promise<
    AxiosResponse<
      ApiResponse<{
        totalRentals: number;
        totalSpent: number;
        favoriteCategories: string[];
        memberSince: string;
        currentStreak: number;
      }>
    >
  > => apiService.get(`${USER_ENDPOINT}/statistics`),

  // Get user addresses
  getAddresses: (): Promise<AxiosResponse<ApiResponse<Address[]>>> =>
    apiService.get(`${USER_ENDPOINT}/addresses`),

  // Add new address
  addAddress: (
    address: Address
  ): Promise<AxiosResponse<ApiResponse<Address>>> =>
    apiService.post(`${USER_ENDPOINT}/addresses`, address),

  // Update address
  updateAddress: (
    addressId: string,
    address: Partial<Address>
  ): Promise<AxiosResponse<ApiResponse<Address>>> =>
    apiService.put(`${USER_ENDPOINT}/addresses/${addressId}`, address),

  // Delete address
  deleteAddress: (
    addressId: string
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    apiService.delete(`${USER_ENDPOINT}/addresses/${addressId}`),

  // Verify email
  verifyEmail: (
    token: string
  ): Promise<AxiosResponse<ApiResponse<{ verified: boolean }>>> =>
    apiService.post(`${USER_ENDPOINT}/verify-email`, { token }),

  // Request password reset
  requestPasswordReset: (
    email: string
  ): Promise<AxiosResponse<ApiResponse<{ sent: boolean }>>> =>
    apiService.post(`${USER_ENDPOINT}/forgot-password`, { email }),

  // Reset password
  resetPassword: (
    token: string,
    newPassword: string
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    apiService.post(`${USER_ENDPOINT}/reset-password`, { token, newPassword }),

  // Get notification settings
  getNotificationSettings: (): Promise<
    AxiosResponse<
      ApiResponse<{
        email: boolean;
        sms: boolean;
        push: boolean;
        marketing: boolean;
      }>
    >
  > => apiService.get(`${USER_ENDPOINT}/notifications`),

  // Update notification settings
  updateNotificationSettings: (settings: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    marketing?: boolean;
  }): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    apiService.put(`${USER_ENDPOINT}/notifications`, settings),
};

export default userService;

// Export types for use in other files
export type {
  UserProfile,
  Address,
  UpdateProfileData,
  PasswordChangeData,
  RentalHistory,
  UserPreferences,
  ApiResponse,
};
