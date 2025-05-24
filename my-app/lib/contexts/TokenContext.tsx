import { createContext, useContext, useReducer } from "react";

interface TokenState {
  balance: number;
  transactions: TokenTransaction[];
  isLoading: boolean;
}
interface TokenTransaction {
  id: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
}
