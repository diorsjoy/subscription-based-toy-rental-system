class SubscriptionAPI {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:9090") {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
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

export const subscriptionAPI = new SubscriptionAPI("http://localhost:9090");
