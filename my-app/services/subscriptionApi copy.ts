// services/subscriptionApi.ts
interface Plan {
  plan_id: number;
  name: string;
  description?: string;
  rental_limit: number;
  price: number;
  duration: string;
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: string;
}

class SubscriptionApiService {
  private baseUrl: string;

  constructor() {
    // Replace with your actual backend URL
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
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

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private getAuthToken(): string | null {
    // Get token from localStorage, cookies, or your auth state management
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  // Get all available subscription plans
  async getPlans(): Promise<{ plans: Plan[] }> {
    try {
      const response = await this.makeRequest<{ plans: Plan[] }>(
        "/v1/subscription/plans"
      );
      return response;
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  }

  // Check if user has an active subscription
  async checkSubscription(): Promise<SubscriptionStatus> {
    try {
      const response = await this.makeRequest<{ sub_status: string }>(
        "/v1/subscription/check"
      );

      // Map the backend response to expected format
      return {
        sub_status: response.sub_status === "STATUS_SUBSCRIBED",
      };
    } catch (error) {
      console.error("Error checking subscription:", error);
      // Return false if user is not authenticated or has no subscription
      return { sub_status: false };
    }
  }

  // Get current subscription details
  async getSubscriptionDetails(): Promise<Subscription> {
    try {
      const response = await this.makeRequest<{
        user_id: number;
        plan_id: number;
        plan_name: string;
        remaining_limit: number;
        expires_at: string;
      }>("/v1/subscription/details");

      return {
        user_id: response.user_id,
        plan_id: response.plan_id,
        plan_name: response.plan_name,
        remaining_limit: response.remaining_limit,
        expires_at: response.expires_at,
      };
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      throw error;
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
      }>("/v1/subscription/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });

      if (response.status === "STATUS_OK") {
        return {
          success: true,
          message: "Subscription created successfully!",
          sub_id: response.sub_id,
        };
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      throw new Error(
        error instanceof Error ? error.message : "Subscription failed"
      );
    }
  }

  // Change subscription plan
  async changePlan(
    planId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ status: string }>(
        "/v1/subscription/change-plan",
        {
          method: "POST",
          body: JSON.stringify({ new_plan_id: planId }),
        }
      );

      if (response.status === "STATUS_OK") {
        return {
          success: true,
          message: "Plan changed successfully!",
        };
      } else {
        throw new Error("Plan change failed");
      }
    } catch (error) {
      console.error("Error changing plan:", error);
      throw new Error(
        error instanceof Error ? error.message : "Plan change failed"
      );
    }
  }

  // Unsubscribe
  async unsubscribe(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ status: string }>(
        "/v1/subscription/unsubscribe",
        {
          method: "POST",
        }
      );

      if (response.status === "STATUS_OK") {
        return {
          success: true,
          message: "Successfully unsubscribed!",
        };
      } else {
        throw new Error("Unsubscribe failed");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      throw new Error(
        error instanceof Error ? error.message : "Unsubscribe failed"
      );
    }
  }

  // Extract from balance (for purchasing toys)
  async extractFromBalance(value: number): Promise<{
    success: boolean;
    message: string;
    remaining: number;
  }> {
    try {
      const response = await this.makeRequest<{
        op_status: string;
        msg: string;
        left: number;
      }>("/v1/subscription/extract-balance", {
        method: "POST",
        body: JSON.stringify({ value }),
      });

      if (response.op_status === "STATUS_OK") {
        return {
          success: true,
          message: response.msg,
          remaining: response.left,
        };
      } else {
        throw new Error(response.msg || "Balance extraction failed");
      }
    } catch (error) {
      console.error("Error extracting from balance:", error);
      throw new Error(
        error instanceof Error ? error.message : "Balance extraction failed"
      );
    }
  }

  // Add to balance (for refunds or credits)
  async addToBalance(value: number): Promise<{
    success: boolean;
    message: string;
    remaining: number;
  }> {
    try {
      const response = await this.makeRequest<{
        op_status: string;
        msg: string;
        left: number;
      }>("/v1/subscription/add-balance", {
        method: "POST",
        body: JSON.stringify({ value }),
      });

      if (response.op_status === "STATUS_OK") {
        return {
          success: true,
          message: response.msg,
          remaining: response.left,
        };
      } else {
        throw new Error(response.msg || "Balance addition failed");
      }
    } catch (error) {
      console.error("Error adding to balance:", error);
      throw new Error(
        error instanceof Error ? error.message : "Balance addition failed"
      );
    }
  }
}

// Create and export a singleton instance
export const subscriptionApi = new SubscriptionApiService();

// Export types for use in components
export type { Plan, Subscription, SubscriptionStatus };
