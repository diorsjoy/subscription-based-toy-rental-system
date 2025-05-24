// services/tokenService.ts
import { apiService } from "@/api/index";
import { AxiosResponse } from "axios";

const TOKEN_ENDPOINT = "/tokens";

// Types for better TypeScript support
interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  currency: string;
  bonus?: number;
  popular?: boolean;
}

interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

interface PurchaseData {
  packageId: string;
  paymentMethod: string;
  currency?: string;
}

interface TransactionFilters {
  type?: "purchase" | "spent" | "earned" | "refund";
  startDate?: string;
  endDate?: string;
}

interface Transaction {
  id: string;
  type: "purchase" | "spent" | "earned" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface TokenBalance {
  current: number;
  total: number;
  spent: number;
  lastUpdated: string;
}

interface RentalParams {
  toyId: number;
  duration: number;
  membershipTier?: string;
}

interface DamageReport {
  description: string;
  severity: "minor" | "major" | "total";
  cost: number;
  images?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const tokenService = {
  // Get available token packages
  getTokenPackages: (): Promise<AxiosResponse<ApiResponse<TokenPackage[]>>> =>
    apiService.get(`${TOKEN_ENDPOINT}/packages`),

  // Get currency conversion rates (for KZT)
  getCurrencyRates: (): Promise<AxiosResponse<ApiResponse<CurrencyRate[]>>> =>
    apiService.get(`${TOKEN_ENDPOINT}/currency-rates`),

  // Calculate package price in KZT
  calculatePrice: (
    packageId: string,
    currency: string = "KZT"
  ): Promise<AxiosResponse<ApiResponse<{ price: number; currency: string }>>> =>
    apiService.get(
      `${TOKEN_ENDPOINT}/calculate-price?packageId=${packageId}&currency=${currency}`
    ),

  // Process token purchase
  purchaseTokens: (
    purchaseData: PurchaseData
  ): Promise<
    AxiosResponse<ApiResponse<{ transactionId: string; tokens: number }>>
  > =>
    apiService.post(`${TOKEN_ENDPOINT}/purchase`, {
      packageId: purchaseData.packageId,
      paymentMethod: purchaseData.paymentMethod,
      currency: purchaseData.currency || "KZT",
    }),

  // Verify payment and credit tokens
  verifyPayment: (
    paymentId: string
  ): Promise<
    AxiosResponse<ApiResponse<{ verified: boolean; tokens: number }>>
  > => apiService.post(`${TOKEN_ENDPOINT}/verify-payment`, { paymentId }),

  // Get user token transactions history
  getTransactionHistory: (
    page: number = 1,
    limit: number = 10,
    filters: TransactionFilters = {}
  ): Promise<
    AxiosResponse<
      ApiResponse<{ transactions: Transaction[]; total: number; pages: number }>
    >
  > => {
    let queryParams = `page=${page}&limit=${limit}`;

    if (filters.type) queryParams += `&type=${filters.type}`;
    if (filters.startDate) queryParams += `&startDate=${filters.startDate}`;
    if (filters.endDate) queryParams += `&endDate=${filters.endDate}`;

    return apiService.get(`${TOKEN_ENDPOINT}/transactions?${queryParams}`);
  },

  // Get token balance
  getBalance: (): Promise<AxiosResponse<ApiResponse<TokenBalance>>> =>
    apiService.get(`${TOKEN_ENDPOINT}/balance`),

  // Calculate token cost for a specific rental
  calculateRentalCost: (
    rentalParams: RentalParams
  ): Promise<AxiosResponse<ApiResponse<{ cost: number; breakdown: any }>>> =>
    apiService.post(`${TOKEN_ENDPOINT}/calculate-rental`, rentalParams),

  // Process token usage for toy rental
  useTokensForRental: (
    rentalId: string
  ): Promise<
    AxiosResponse<ApiResponse<{ success: boolean; remainingTokens: number }>>
  > =>
    apiService.post(`${TOKEN_ENDPOINT}/use`, {
      rentalId,
      type: "RENTAL",
    }),

  // Process token usage for rental extension
  useTokensForExtension: (
    rentalId: string,
    days: number
  ): Promise<
    AxiosResponse<
      ApiResponse<{ success: boolean; cost: number; remainingTokens: number }>
    >
  > =>
    apiService.post(`${TOKEN_ENDPOINT}/use`, {
      rentalId,
      days,
      type: "EXTENSION",
    }),

  // Process token refund (partial or full)
  refundTokens: (
    rentalId: string,
    reason: string
  ): Promise<
    AxiosResponse<ApiResponse<{ refundAmount: number; transactionId: string }>>
  > =>
    apiService.post(`${TOKEN_ENDPOINT}/refund`, {
      rentalId,
      reason,
    }),

  // Process token payment for damages
  payForDamages: (
    rentalId: string,
    damageReport: DamageReport
  ): Promise<
    AxiosResponse<ApiResponse<{ paymentId: string; tokensUsed: number }>>
  > =>
    apiService.post(`${TOKEN_ENDPOINT}/damage-payment`, {
      rentalId,
      damageReport,
    }),
};

export default tokenService;

// Export types for use in other files
export type {
  TokenPackage,
  CurrencyRate,
  PurchaseData,
  TransactionFilters,
  Transaction,
  TokenBalance,
  RentalParams,
  DamageReport,
  ApiResponse,
};
