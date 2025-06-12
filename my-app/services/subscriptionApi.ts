interface Plan {
  plan_id: number;
  name: string;
  description?: string;
  rental_limit: number;
  price: number;
  duration: number;
}

interface Subscription {
  user_id: number;
  plan_id: number;
  plan_name: string;
  remaining_limit: number;
  expires_at: string;
}

interface SubscriptionStatus {
  sub_status: boolean;
}

interface BackendPlan {
  planId?: number;
  plan_id?: number; // Support both formats
  name: string;
  description?: string;
  rentalLimit?: number;
  rental_limit?: number; // Support both formats
  price: number;
  duration: number;
}

interface BackendSubscription {
  userId: string;
  planId: number;
  planName: string;
  remainingLimit: number;
  expiresAt: string;
}

// Centralized status mapping for your backend's string responses
const STATUS_MAPPING = {
  STATUS_OK: "STATUS_OK",
  STATUS_SUBSCRIBED: "STATUS_SUBSCRIBED", // This is what your backend returns
  STATUS_NOT_SUBSCRIBED: "STATUS_NOT_SUBSCRIBED",
} as const;

class SubscriptionApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL_SUB || "http://localhost:9090";
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  private validateStatusResponse(status: string, operation: string): boolean {
    if (status === STATUS_MAPPING.STATUS_OK) {
      return true;
    }
    throw new Error(`${operation} failed with status: ${status}`);
  }

  // Get all available subscription plans - Fixed for flexible response format
  async getPlans(): Promise<{ plans: Plan[] }> {
    try {
      const response = await this.makeRequest<{ plans: BackendPlan[] }>(
        "/v1/subscription/plans"
      );

      console.log("Raw plans response:", response);

      // Map backend format to frontend format
      const mappedPlans: Plan[] = (response.plans || []).map((plan) => ({
        plan_id: plan.planId || plan.plan_id || 0,
        name: plan.name,
        description: plan.description,
        rental_limit: plan.rentalLimit || plan.rental_limit || 0,
        price: plan.price,
        duration: plan.duration,
      }));

      console.log("Mapped plans:", mappedPlans);

      return { plans: mappedPlans };
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw new Error("Failed to load subscription plans");
    }
  }

  // Check if user has an active subscription - FIXED FOR STRING STATUS
  async checkSubscription(): Promise<SubscriptionStatus> {
    try {
      // Your backend returns: {subStatus: "STATUS_SUBSCRIBED"}
      const response = await this.makeRequest<{ subStatus: string }>(
        "/v1/subscription/check"
      );

      console.log("Raw subscription check response:", response);

      // Convert string status to boolean
      const isSubscribed =
        response.subStatus === STATUS_MAPPING.STATUS_SUBSCRIBED;

      console.log("Parsed subscription status:", {
        rawStatus: response.subStatus,
        isSubscribed,
        expectedStatus: STATUS_MAPPING.STATUS_SUBSCRIBED,
      });

      return {
        sub_status: isSubscribed,
      };
    } catch (error) {
      console.error("Error checking subscription:", error);
      return { sub_status: false };
    }
  }

  // Get current subscription details - Fixed for camelCase response
  async getSubscriptionDetails(): Promise<Subscription> {
    try {
      const response = await this.makeRequest<BackendSubscription>(
        "/v1/subscription"
      );

      console.log("Raw subscription details response:", response);

      // Map camelCase response to snake_case interface
      const mappedSubscription: Subscription = {
        user_id: parseInt(response.userId), // Convert string to number
        plan_id: response.planId,
        plan_name: response.planName,
        remaining_limit: response.remainingLimit,
        expires_at: response.expiresAt,
      };

      console.log("Mapped subscription:", mappedSubscription);

      return mappedSubscription;
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      throw new Error("Failed to load subscription details");
    }
  }

  // Subscribe to a plan
  async subscribe(
    planId: number
  ): Promise<{ success: boolean; message: string; sub_id?: number }> {
    try {
      const response = await this.makeRequest<{
        sub_id: number;
        status: string;
      }>("/v1/subscription", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });

      console.log("Subscribe response:", response);

      this.validateStatusResponse(response.status, "Subscription");

      return {
        success: true,
        message: "Subscription created successfully!",
        sub_id: response.sub_id,
      };
    } catch (error) {
      console.error("Error subscribing:", error);
      const message =
        error instanceof Error ? error.message : "Subscription failed";
      return {
        success: false,
        message,
      };
    }
  }

  // Change subscription plan
  async changePlan(
    planId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ status: string }>(
        "/v1/subscription/plan",
        {
          method: "PUT",
          body: JSON.stringify({ new_plan_id: planId }),
        }
      );

      console.log("Change plan response:", response);

      this.validateStatusResponse(response.status, "Plan change");

      return {
        success: true,
        message: "Plan changed successfully!",
      };
    } catch (error) {
      console.error("Error changing plan:", error);
      const message =
        error instanceof Error ? error.message : "Plan change failed";
      return {
        success: false,
        message,
      };
    }
  }

  // Unsubscribe
  async unsubscribe(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ status: string }>(
        "/v1/subscription",
        {
          method: "DELETE",
        }
      );

      console.log("Unsubscribe response:", response);

      this.validateStatusResponse(response.status, "Unsubscribe");

      return {
        success: true,
        message: "Successfully unsubscribed!",
      };
    } catch (error) {
      console.error("Error unsubscribing:", error);
      const message =
        error instanceof Error ? error.message : "Unsubscribe failed";
      return {
        success: false,
        message,
      };
    }
  }

  // Extract from balance - Fixed for your backend response format
  async extractFromBalance(value: number): Promise<{
    success: boolean;
    message: string;
    remaining: number;
  }> {
    try {
      const response = await this.makeRequest<{
        opStatus: string;
        msg: string;
        left: number;
      }>("/v1/subscription/extract", {
        method: "PATCH",
        body: JSON.stringify({ value }),
      });

      console.log("Extract balance response:", response);

      this.validateStatusResponse(response.opStatus, "Balance extraction");

      return {
        success: true,
        message: response.msg,
        remaining: response.left,
      };
    } catch (error) {
      console.error("Error extracting from balance:", error);
      const message =
        error instanceof Error ? error.message : "Balance extraction failed";
      throw new Error(message);
    }
  }

  // Add to balance - Fixed for your backend response format
  async addToBalance(value: number): Promise<{
    success: boolean;
    message: string;
    remaining: number;
  }> {
    try {
      const response = await this.makeRequest<{
        opStatus: string;
        msg: string;
        left: number;
      }>("/v1/subscription/add", {
        method: "PATCH",
        body: JSON.stringify({ value }),
      });

      console.log("Add balance response:", response);

      this.validateStatusResponse(response.opStatus, "Balance addition");

      return {
        success: true,
        message: response.msg,
        remaining: response.left,
      };
    } catch (error) {
      console.error("Error adding to balance:", error);
      const message =
        error instanceof Error ? error.message : "Balance addition failed";
      throw new Error(message);
    }
  }
}

// Create and export singleton instance
export const subscriptionApi = new SubscriptionApiService();

// Export types for use in components
export type { Plan, Subscription, SubscriptionStatus };
