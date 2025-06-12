"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useCart } from "@/components/cart";
import { ShoppingCart, Loader2, Crown, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface RentalButtonProps {
  toyId: number;
  toyName: string;
  tokenCost?: number;
  onRentSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

export const EnhancedRentalButton: React.FC<RentalButtonProps> = ({
  toyId,
  toyName,
  tokenCost = 1,
  onRentSuccess,
  disabled = false,
  className = "",
}) => {
  const [isRenting, setIsRenting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { subscription, isSubscribed, canRentToy, rentToy } = useSubscription();
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

    if (!isSubscribed) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to rent toys.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/subscription")}
          >
            Subscribe Now
          </Button>
        ),
      });
      return;
    }

    if (!canRentToy(tokenCost)) {
      toast({
        title: "Insufficient Rental Limit",
        description: `You need ${tokenCost} rentals but only have ${
          subscription?.remaining_limit || 0
        } remaining.`,
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/profile?tab=manage")}
          >
            Upgrade Plan
          </Button>
        ),
      });
      return;
    }

    setIsRenting(true);
    try {
      const result = await rentToy(tokenCost);

      if (result.success) {
        toast({
          title: "Rental Successful!",
          description: `${toyName} has been rented successfully. ${result.left} rentals remaining.`,
        });
        onRentSuccess?.();
      } else {
        throw new Error(result.message || "Rental failed");
      }
    } catch (error) {
      console.error("Rental error:", error);
      toast({
        title: "Rental Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to rent toy. Please try again.",
        variant: "destructive",
      });
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

    try {
      await addItem(toyId);
      toast({
        title: "Added to Cart",
        description: `${toyName} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Add",
        description: "Unable to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRentalButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: "Login to Rent",
        variant: "outline" as const,
        disabled: false,
      };
    }

    if (!isSubscribed) {
      return {
        text: "Subscribe to Rent",
        variant: "outline" as const,
        disabled: false,
      };
    }

    if (!canRentToy(tokenCost)) {
      return {
        text: "Insufficient Rentals",
        variant: "destructive" as const,
        disabled: true,
      };
    }

    if (isRenting) {
      return {
        text: "Renting...",
        variant: "default" as const,
        disabled: true,
      };
    }

    return {
      text: `Rent for ${tokenCost} ${tokenCost === 1 ? "rental" : "rentals"}`,
      variant: "default" as const,
      disabled: false,
    };
  };

  const buttonState = getRentalButtonState();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Subscription Status Info */}
      {isAuthenticated && (
        <div className="space-y-2">
          {isSubscribed && subscription ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {subscription.plan_name.toLowerCase().includes("premium") && (
                  <Crown className="w-4 h-4 text-purple-600" />
                )}
                <Badge variant="secondary" className="text-xs">
                  {subscription.plan_name}
                </Badge>
              </div>
              <span className="text-muted-foreground">
                {subscription.remaining_limit} rentals left
              </span>
            </div>
          ) : (
            <Alert className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Subscribe to start renting toys
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleRent}
          disabled={disabled || buttonState.disabled}
          variant={buttonState.variant}
          className="flex-1"
        >
          {isRenting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {buttonState.text}
            </>
          ) : (
            buttonState.text
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleAddToCart}
          disabled={!isAuthenticated || disabled}
          className="px-3"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>

      {/* Cost Information */}
      {tokenCost > 1 && (
        <p className="text-xs text-muted-foreground text-center">
          This premium toy requires {tokenCost} rentals
        </p>
      )}
    </div>
  );
};
