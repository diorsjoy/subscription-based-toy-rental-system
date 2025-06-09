class SubscriptionAPI {
  private baseURL: string;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL_SUB ||
      "http://localhost:9090"
  ) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get all available plans
  async getPlans(): Promise<{ plans: Plan[] }> {
    return this.makeRequest("/v1/subscription/plans");
  }

  // Subscribe to a plan
  async subscribe(planId: number): Promise<{ sub_id: number; status: string }> {
    return this.makeRequest("/v1/subscription/subscribe", {
      method: "POST",
      body: JSON.stringify({ plan_id: planId }),
    });
  }

  // Get subscription details
  async getSubscriptionDetails(): Promise<Subscription> {
    return this.makeRequest("/v1/subscription/details");
  }

  // Check if user is subscribed
  async checkSubscription(): Promise<SubscriptionStatus> {
    return this.makeRequest("/v1/subscription/check");
  }

  // Change subscription plan
  async changePlan(newPlanId: number): Promise<{ status: string }> {
    return this.makeRequest("/v1/subscription/change-plan", {
      method: "POST",
      body: JSON.stringify({ new_plan_id: newPlanId }),
    });
  }

  // Unsubscribe
  async unsubscribe(): Promise<{ status: string }> {
    return this.makeRequest("/v1/subscription/unsubscribe", {
      method: "DELETE",
    });
  }

  // Extract from balance (for toy rentals)
  async extractFromBalance(value: number): Promise<{
    op_status: string;
    msg: string;
    left: number;
  }> {
    return this.makeRequest("/v1/subscription/extract-balance", {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  }

  // Add to balance (token purchase)
  async addToBalance(value: number): Promise<{
    op_status: string;
    msg: string;
    left: number;
  }> {
    return this.makeRequest("/v1/subscription/add-balance", {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  }
}

// Import interfaces
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

export const subscriptionAPI = new SubscriptionAPI();
