// hooks/useSubscription.ts
import { useState, useEffect, useCallback } from "react";
import {
  subscriptionApi,
  type Subscription,
  type Plan,
} from "@/services/subscriptionApi";

interface UseSubscriptionReturn {
  // State
  subscription: Subscription | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  isSubscribed: boolean;

  // Methods
  canRentToy: (cost?: number) => boolean;
  rentToy: (toyCost?: number) => Promise<any>;
  addTokens: (amount: number) => Promise<any>;
  subscribe: (planId: number) => Promise<boolean>;
  changePlan: (newPlanId: number) => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  loadPlans: () => Promise<void>;
  refreshAll: () => Promise<void>; // Added this method
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      setError(null);
      console.log("Checking subscription status...");

      const status = await subscriptionApi.checkSubscription();
      console.log("Subscription status result:", status);

      if (status.sub_status) {
        console.log("User is subscribed, loading details...");
        const details = await subscriptionApi.getSubscriptionDetails();
        console.log("Subscription details loaded:", details);
        setSubscription(details);
      } else {
        console.log("User is not subscribed");
        setSubscription(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Subscription check error:", errorMessage);
      setError(errorMessage);
      setSubscription(null);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      console.log("Loading subscription plans...");
      const response = await subscriptionApi.getPlans();
      console.log("Plans loaded:", response);
      setPlans(response.plans || []);
    } catch (err) {
      console.error("Failed to load plans:", err);
      setPlans([]);
    }
  }, []);

  // Add refreshAll method
  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Refreshing all subscription data...");

      await Promise.all([checkSubscription(), loadPlans()]);

      console.log("All data refreshed successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh data";
      console.error("Refresh all error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [checkSubscription, loadPlans]);

  const canRentToy = useCallback(
    (cost: number = 1): boolean => {
      return subscription ? subscription.remaining_limit >= cost : false;
    },
    [subscription]
  );

  const rentToy = useCallback(
    async (toyCost: number = 1) => {
      if (!canRentToy(toyCost)) {
        throw new Error("Insufficient rental limit");
      }

      try {
        const result = await subscriptionApi.extractFromBalance(toyCost);

        if (result.success && subscription) {
          setSubscription((prev) =>
            prev
              ? {
                  ...prev,
                  remaining_limit: result.remaining,
                }
              : null
          );
        }

        return result;
      } catch (err) {
        throw new Error("Failed to deduct from balance");
      }
    },
    [subscription, canRentToy]
  );

  const addTokens = useCallback(
    async (amount: number) => {
      try {
        const result = await subscriptionApi.addToBalance(amount);

        if (result.success && subscription) {
          setSubscription((prev) =>
            prev
              ? {
                  ...prev,
                  remaining_limit: result.remaining,
                }
              : null
          );
        }

        return result;
      } catch (err) {
        throw new Error("Failed to add tokens to balance");
      }
    },
    [subscription]
  );

  const subscribe = useCallback(
    async (planId: number): Promise<boolean> => {
      try {
        console.log("Attempting to subscribe to plan:", planId);
        setError(null);

        const result = await subscriptionApi.subscribe(planId);
        console.log("Subscribe API result:", result);

        if (result.success) {
          console.log("Subscription successful, refreshing data...");
          await checkSubscription(); // Refresh subscription data
          return true;
        }

        const errorMessage = result.message || "Subscription failed";
        setError(errorMessage);
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Subscription failed";
        console.error("Subscribe error:", errorMessage);
        setError(errorMessage);
        return false;
      }
    },
    [checkSubscription]
  );

  const changePlan = useCallback(
    async (newPlanId: number): Promise<boolean> => {
      try {
        console.log("Attempting to change to plan:", newPlanId);
        setError(null);

        const result = await subscriptionApi.changePlan(newPlanId);
        console.log("Change plan API result:", result);

        if (result.success) {
          console.log("Plan change successful, refreshing data...");
          await checkSubscription(); // Refresh subscription data
          return true;
        }

        const errorMessage = result.message || "Failed to change plan";
        setError(errorMessage);
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to change plan";
        console.error("Change plan error:", errorMessage);
        setError(errorMessage);
        return false;
      }
    },
    [checkSubscription]
  );

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Attempting to unsubscribe...");
      setError(null);

      const result = await subscriptionApi.unsubscribe();
      console.log("Unsubscribe API result:", result);

      if (result.success) {
        console.log("Unsubscribe successful, clearing subscription data...");
        setSubscription(null);
        return true;
      }

      const errorMessage = result.message || "Failed to unsubscribe";
      setError(errorMessage);
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unsubscribe";
      console.error("Unsubscribe error:", errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Initializing subscription data...");

        await Promise.all([checkSubscription(), loadPlans()]);

        console.log("Subscription data initialized successfully");
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to initialize";
          console.error("Initialization error:", errorMessage);
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, [checkSubscription, loadPlans]);

  return {
    // State
    subscription,
    plans,
    loading,
    error,
    isSubscribed: !!subscription,

    // Methods
    canRentToy,
    rentToy,
    addTokens,
    subscribe,
    changePlan,
    unsubscribe,
    refreshSubscription: checkSubscription,
    loadPlans,
    refreshAll, // Export the new method
  };
};
