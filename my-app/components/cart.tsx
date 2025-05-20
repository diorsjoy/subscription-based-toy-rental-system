"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  title: string;
  tokens: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartButton() {
  const { items } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <CartDrawer />
      </SheetContent>
    </Sheet>
  );
}

function CartDrawer() {
  const { items, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const totalTokens = items.reduce((sum, item) => sum + item.tokens, 0);

  const handleCheckout = () => {
    // In a real application, you would initiate the checkout process here
    toast({
      title: "Checkout Initiated",
      description: "Redirecting to payment page...",
    });
    clearCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto py-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Your cart is empty
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <span>{item.title}</span>
              <div className="flex items-center">
                <span className="mr-2">{item.tokens} tokens</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">{totalTokens} tokens</span>
          </div>
          <Button className="w-full mb-2" onClick={handleCheckout}>
            Checkout
          </Button>
          <Button variant="outline" className="w-full" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
}
