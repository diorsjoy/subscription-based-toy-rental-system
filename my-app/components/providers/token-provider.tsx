// components/providers/token-provider.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
interface TokenState {
  balance: number;
  transactions: TokenTransaction[];
  packages: TokenPackage[];
  isLoading: boolean;
  error: string | null;
}

interface TokenTransaction {
  id: string;
  type: "purchase" | "rental" | "refund" | "bonus";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

interface TokenPackage {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  isPopular?: boolean;
  features: string[];
  bonus?: string;
}

interface TokenContextType extends TokenState {
  currentTokens: number;
  tokens: number; // Alias for balance to match your component expectations
  membershipTier: string;
  addTokens: (amount: number, description?: string) => void;
  useTokens: (amount: number, description?: string) => boolean;
  purchaseTokens: (
    packageId: string,
    paymentMethod: string,
    totalTokens?: number
  ) => Promise<boolean>;
  getTransactionHistory: () => TokenTransaction[];
  refreshBalance: () => void;
}

// Initial state with more realistic mock data
const initialState: TokenState = {
  balance: 150, // Mock initial balance
  transactions: [
    {
      id: "t1",
      type: "purchase",
      amount: 100,
      description: "Token Package Purchase - Family Pack",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      status: "completed",
    },
    {
      id: "t2",
      type: "rental",
      amount: -25,
      description: "Rental: LEGO Architecture Burj Khalifa",
      date: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      status: "completed",
    },
    {
      id: "t3",
      type: "purchase",
      amount: 75,
      description: "Token Package Purchase - Starter Pack",
      date: new Date(Date.now() - 604800000).toISOString(), // Week ago
      status: "completed",
    },
  ],
  packages: [
    {
      id: "starter",
      name: "Starter Pack",
      description: "Perfect for trying out our service",
      amount: 50,
      price: 500, // ₸500 for 50 tokens
      features: ["50 Tokens", "Valid for 3 months", "Email support"],
    },
    {
      id: "family",
      name: "Family Pack",
      description: "Most popular choice for families",
      amount: 120,
      price: 1080, // ₸1080 for 120 tokens (10% bonus)
      originalPrice: 1200,
      discount: 10,
      isPopular: true,
      features: [
        "100 + 20 Bonus Tokens",
        "Valid for 6 months",
        "Priority support",
      ],
      bonus: "20 Bonus Tokens",
    },
    {
      id: "premium",
      name: "Premium Pack",
      description: "Best value for frequent renters",
      amount: 250,
      price: 2125, // ₸2125 for 250 tokens (15% bonus)
      originalPrice: 2500,
      discount: 15,
      features: [
        "200 + 50 Bonus Tokens",
        "Valid for 12 months",
        "VIP support",
        "Early access",
      ],
      bonus: "50 Bonus Tokens",
    },
    {
      id: "ultimate",
      name: "Ultimate Pack",
      description: "For the ultimate toy rental experience",
      amount: 500,
      price: 4000, // ₸4000 for 500 tokens (20% bonus)
      originalPrice: 5000,
      discount: 20,
      features: [
        "400 + 100 Bonus Tokens",
        "Valid for 24 months",
        "Concierge support",
        "Premium toys access",
      ],
      bonus: "100 Bonus Tokens",
    },
  ],
  isLoading: false,
  error: null,
};

// Action types
type TokenAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_BALANCE"; payload: number }
  | { type: "ADD_TRANSACTION"; payload: TokenTransaction }
  | { type: "SET_PACKAGES"; payload: TokenPackage[] }
  | { type: "REFRESH_DATA" };

// Reducer
function tokenReducer(state: TokenState, action: TokenAction): TokenState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        balance: state.balance + action.payload.amount,
      };
    case "SET_PACKAGES":
      return { ...state, packages: action.payload };
    case "REFRESH_DATA":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

// Helper function to determine membership tier based on total spent
const getMembershipTier = (transactions: TokenTransaction[]): string => {
  const totalSpent = transactions
    .filter((t) => t.type === "purchase")
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalSpent >= 1000) return "platinum";
  if (totalSpent >= 500) return "gold";
  if (totalSpent >= 200) return "silver";
  return "bronze";
};

// Context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Provider component
export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tokenReducer, initialState);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    // In a real app, you would load this from your API
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("tokenBalance");
      const savedTransactions = localStorage.getItem("tokenTransactions");

      if (savedBalance) {
        const balance = parseInt(savedBalance);
        if (!isNaN(balance)) {
          dispatch({ type: "SET_BALANCE", payload: balance });
        }
      }

      if (savedTransactions) {
        try {
          const transactions = JSON.parse(savedTransactions);
          if (Array.isArray(transactions)) {
            // You might want to merge with existing transactions or replace them
            // For now, we'll keep the existing ones
          }
        } catch (error) {
          console.error("Failed to parse saved transactions:", error);
        }
      }
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tokenBalance", state.balance.toString());
      localStorage.setItem(
        "tokenTransactions",
        JSON.stringify(state.transactions)
      );
    }
  }, [state.balance, state.transactions]);

  const addTokens = (amount: number, description = "Token credit") => {
    const transaction: TokenTransaction = {
      id: `t_${Date.now()}`,
      type: "purchase",
      amount,
      description,
      date: new Date().toISOString(),
      status: "completed",
    };

    dispatch({ type: "ADD_TRANSACTION", payload: transaction });

    toast({
      title: "Tokens Added! 🎉",
      description: `${amount} tokens have been added to your account.`,
    });
  };

  const useTokens = (amount: number, description = "Token usage"): boolean => {
    if (state.balance < amount) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${amount - state.balance} more tokens.`,
        variant: "destructive",
      });
      return false;
    }

    const transaction: TokenTransaction = {
      id: `t_${Date.now()}`,
      type: "rental",
      amount: -amount,
      description,
      date: new Date().toISOString(),
      status: "completed",
    };

    dispatch({ type: "ADD_TRANSACTION", payload: transaction });

    toast({
      title: "Tokens Used",
      description: `${amount} tokens deducted for ${description}`,
    });

    return true;
  };

  const purchaseTokens = async (
    packageId: string,
    paymentMethod: string,
    totalTokens?: number
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Find the package
      const tokenPackage = state.packages.find((pkg) => pkg.id === packageId);
      if (!tokenPackage && !totalTokens) {
        throw new Error("Package not found");
      }

      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random failures (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Payment processing failed");
      }

      // Add tokens
      const tokensToAdd = totalTokens || tokenPackage!.amount;
      const packageName = tokenPackage?.name || "Custom Amount";

      addTokens(tokensToAdd, `Purchased ${packageName} via ${paymentMethod}`);

      dispatch({ type: "SET_LOADING", payload: false });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Purchase failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });

      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  const getTransactionHistory = (): TokenTransaction[] => {
    return state.transactions;
  };

  const refreshBalance = () => {
    // In a real app, this would fetch from your API
    dispatch({ type: "SET_LOADING", payload: true });
    setTimeout(() => {
      dispatch({ type: "REFRESH_DATA" });
      toast({
        title: "Balance Refreshed",
        description: "Your token balance has been updated.",
      });
    }, 1000);
  };

  const membershipTier = getMembershipTier(state.transactions);

  const value: TokenContextType = {
    ...state,
    currentTokens: state.balance, // This was missing!
    tokens: state.balance, // Alias for components expecting 'tokens'
    membershipTier,
    addTokens,
    useTokens,
    purchaseTokens,
    getTransactionHistory,
    refreshBalance,
  };

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

// Hook to use the token context
export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
}
