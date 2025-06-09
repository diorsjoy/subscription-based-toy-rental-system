"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useTokens } from "@/components/providers/token-provider";
import { useRentals } from "@/components/providers/rental-provider";
import { useCart } from "@/components/cart";
import { ShoppingCart, Loader2 } from "lucide-react";

interface RentalButtonProps {
  toyId: number;
  toyName: string;
  tokenCost?: number;
  onRentSuccess?: () => void;
}

export const RentalButton: React.FC<RentalButtonProps> = ({
  toyId,
  toyName,
  tokenCost = 25,
  onRentSuccess,
}) => {
  const [isRenting, setIsRenting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { tokens } = useTokens();
  const { createRental } = useRentals();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleRent = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rent toys.",
        variant: "destructive",
      });
      return;
    }

    if (tokens < tokenCost) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${tokenCost} tokens to rent this toy. You have ${tokens} tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsRenting(true);
    try {
      const success = await createRental(toyId, toyName, tokenCost);
      if (success) {
        onRentSuccess?.();
      }
    } catch (error) {
      console.error("Rental error:", error);
    } finally {
      setIsRenting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    await addItem(toyId);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleRent}
        disabled={isRenting || !isAuthenticated || tokens < tokenCost}
        className="flex-1"
      >
        {isRenting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Renting...
          </>
        ) : (
          `Rent for ${tokenCost} tokens`
        )}
      </Button>

      <Button
        variant="outline"
        onClick={handleAddToCart}
        disabled={!isAuthenticated}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};
