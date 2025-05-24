// components/providers/rental-provider.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTokens } from "@/components/providers/token-provider";

// Types
interface RentalState {
  currentRentals: Rental[];
  rentalHistory: Rental[];
  isLoading: boolean;
  error: string | null;
}

interface Rental {
  id: string;
  toyId: number;
  toyName: string;
  toyImage: string;
  startDate: string;
  endDate: string;
  status: "active" | "returned" | "overdue" | "extending";
  tokens: number;
  rating?: number;
}

interface RentalContextType extends RentalState {
  createRental: (
    toyId: number,
    toyName: string,
    tokens: number,
    duration: number
  ) => Promise<boolean>;
  extendRental: (rentalId: string, additionalDays: number) => Promise<boolean>;
  returnRental: (rentalId: string, rating?: number) => Promise<boolean>;
  getRentalById: (rentalId: string) => Rental | undefined;
  refreshRentals: () => void;
}

// Initial state with mock data
const initialState: RentalState = {
  currentRentals: [
    {
      id: "r1",
      toyId: 1,
      toyName: "LEGO Architecture Burj Khalifa",
      toyImage: "/placeholder.svg?height=100&width=100",
      startDate: "2024-06-01",
      endDate: "2024-06-15",
      status: "active",
      tokens: 85,
    },
    {
      id: "r2",
      toyId: 3,
      toyName: "National Geographic Break Open Geodes Kit",
      toyImage: "/placeholder.svg?height=100&width=100",
      startDate: "2024-05-28",
      endDate: "2024-06-12",
      status: "extending",
      tokens: 55,
    },
  ],
  rentalHistory: [
    {
      id: "r3",
      toyId: 2,
      toyName: "Melissa & Doug Deluxe Kitchen Set",
      toyImage: "/placeholder.svg?height=100&width=100",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      status: "returned",
      tokens: 75,
      rating: 5,
    },
  ],
  isLoading: false,
  error: null,
};

// Action types
type RentalAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_RENTAL"; payload: Rental }
  | { type: "UPDATE_RENTAL"; payload: { id: string; updates: Partial<Rental> } }
  | { type: "MOVE_TO_HISTORY"; payload: string }
  | { type: "SET_CURRENT_RENTALS"; payload: Rental[] }
  | { type: "SET_RENTAL_HISTORY"; payload: Rental[] };

// Reducer
function rentalReducer(state: RentalState, action: RentalAction): RentalState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "ADD_RENTAL":
      return {
        ...state,
        currentRentals: [...state.currentRentals, action.payload],
      };
    case "UPDATE_RENTAL":
      return {
        ...state,
        currentRentals: state.currentRentals.map((rental) =>
          rental.id === action.payload.id
            ? { ...rental, ...action.payload.updates }
            : rental
        ),
      };
    case "MOVE_TO_HISTORY":
      const rentalToMove = state.currentRentals.find(
        (r) => r.id === action.payload
      );
      if (!rentalToMove) return state;

      return {
        ...state,
        currentRentals: state.currentRentals.filter(
          (r) => r.id !== action.payload
        ),
        rentalHistory: [rentalToMove, ...state.rentalHistory],
      };
    case "SET_CURRENT_RENTALS":
      return { ...state, currentRentals: action.payload };
    case "SET_RENTAL_HISTORY":
      return { ...state, rentalHistory: action.payload };
    default:
      return state;
  }
}

// Context
const RentalContext = createContext<RentalContextType | undefined>(undefined);

// Provider component
export function RentalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(rentalReducer, initialState);
  const { toast } = useToast();
  const { useTokens: consumeTokens } = useTokens();

  // Load initial data
  useEffect(() => {
    // In a real app, you would load this from your API
    const savedRentals = localStorage.getItem("currentRentals");
    if (savedRentals) {
      try {
        const rentals = JSON.parse(savedRentals);
        dispatch({ type: "SET_CURRENT_RENTALS", payload: rentals });
      } catch (error) {
        console.error("Failed to load saved rentals:", error);
      }
    }
  }, []);

  // Save rentals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "currentRentals",
      JSON.stringify(state.currentRentals)
    );
  }, [state.currentRentals]);

  const createRental = async (
    toyId: number,
    toyName: string,
    tokens: number,
    duration: number = 14
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Check if user has enough tokens
      const hasTokens = consumeTokens(tokens, `Rental: ${toyName}`);
      if (!hasTokens) {
        dispatch({ type: "SET_LOADING", payload: false });
        return false;
      }

      // Create new rental
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + duration);

      const newRental: Rental = {
        id: `r_${Date.now()}`,
        toyId,
        toyName,
        toyImage: "/placeholder.svg?height=100&width=100",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        status: "active",
        tokens,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      dispatch({ type: "ADD_RENTAL", payload: newRental });
      dispatch({ type: "SET_LOADING", payload: false });

      toast({
        title: "Rental Created! 🎉",
        description: `Successfully rented ${toyName} for ${duration} days.`,
      });

      return true;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create rental" });
      return false;
    }
  };

  const extendRental = async (
    rentalId: string,
    additionalDays: number
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const rental = state.currentRentals.find((r) => r.id === rentalId);
      if (!rental) {
        throw new Error("Rental not found");
      }

      // Calculate extension cost (simplified)
      const extensionCost = Math.round(
        (rental.tokens / 14) * additionalDays * 0.9
      );

      // Check if user has enough tokens
      const hasTokens = consumeTokens(
        extensionCost,
        `Extension: ${rental.toyName}`
      );
      if (!hasTokens) {
        dispatch({ type: "SET_LOADING", payload: false });
        return false;
      }

      // Calculate new end date
      const currentEndDate = new Date(rental.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(currentEndDate.getDate() + additionalDays);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({
        type: "UPDATE_RENTAL",
        payload: {
          id: rentalId,
          updates: {
            endDate: newEndDate.toISOString().split("T")[0],
            status: "active",
          },
        },
      });

      dispatch({ type: "SET_LOADING", payload: false });

      toast({
        title: "Rental Extended! ⏰",
        description: `Extended ${rental.toyName} by ${additionalDays} days.`,
      });

      return true;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to extend rental" });
      return false;
    }
  };

  const returnRental = async (
    rentalId: string,
    rating?: number
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const rental = state.currentRentals.find((r) => r.id === rentalId);
      if (!rental) {
        throw new Error("Rental not found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update rental with return info
      const updatedRental = {
        ...rental,
        status: "returned" as const,
        rating,
      };

      // Move to history
      dispatch({
        type: "UPDATE_RENTAL",
        payload: {
          id: rentalId,
          updates: updatedRental,
        },
      });

      setTimeout(() => {
        dispatch({ type: "MOVE_TO_HISTORY", payload: rentalId });
      }, 100);

      dispatch({ type: "SET_LOADING", payload: false });

      toast({
        title: "Toy Returned! ✅",
        description: `Successfully returned ${rental.toyName}.`,
      });

      return true;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to return rental" });
      return false;
    }
  };

  const getRentalById = (rentalId: string): Rental | undefined => {
    return (
      state.currentRentals.find((r) => r.id === rentalId) ||
      state.rentalHistory.find((r) => r.id === rentalId)
    );
  };

  const refreshRentals = () => {
    dispatch({ type: "SET_LOADING", payload: true });
    // In a real app, this would fetch from your API
    setTimeout(() => {
      dispatch({ type: "SET_LOADING", payload: false });
    }, 1000);
  };

  const value: RentalContextType = {
    ...state,
    createRental,
    extendRental,
    returnRental,
    getRentalById,
    refreshRentals,
  };

  return (
    <RentalContext.Provider value={value}>{children}</RentalContext.Provider>
  );
}

// Hook to use the rental context
export function useRentals() {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error("useRentals must be used within a RentalProvider");
  }
  return context;
}
