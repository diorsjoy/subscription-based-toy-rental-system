import { useState, useEffect } from "react";
import { Subscription } from "@/types/subscription";
import { subscriptionAPI } from "@/api/subscription";

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const status = await subscriptionAPI.checkSubscription();

      if (status.sub_status) {
        const details = await subscriptionAPI.getSubscriptionDetails();
        setSubscription(details);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const canRentToy = () => {
    return subscription && subscription.remaining_limit > 0;
  };

  const rentToy = async (toyCost: number = 1) => {
    if (!canRentToy()) {
      throw new Error("Недостаточно лимита для аренды");
    }

    try {
      const result = await subscriptionAPI.extractFromBalance(toyCost);

      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          remaining_limit: result.left,
        });
      }

      return result;
    } catch (err) {
      throw new Error("Ошибка при списании с баланса");
    }
  };

  const addTokens = async (amount: number) => {
    try {
      const result = await subscriptionAPI.addToBalance(amount);

      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          remaining_limit: result.left,
        });
      }

      return result;
    } catch (err) {
      throw new Error("Ошибка при пополнении баланса");
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    canRentToy,
    rentToy,
    addTokens,
    refreshSubscription: checkSubscription,
  };
};
