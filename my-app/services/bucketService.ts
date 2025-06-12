// services/bucketService.ts

interface BucketToy {
  toy_id: number;
  name: string;
  value: number;
  image_url: string;
  quantity: number;
}

interface BucketResponse {
  toys: BucketToy[];
  total_value: number;
  total_items: number;
}

interface AddToyRequest {
  toy_id: number;
  quantity?: number;
}

interface RemoveToyRequest {
  toy_ids: number[];
}

class BucketService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_BUCKET_SERVICE_URL || "http://localhost:2020";
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
      console.log(`Making request to: ${this.baseUrl}${endpoint}`);
      console.log("Request config:", config);

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error(`Bucket API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  // Get user's bucket contents
  async getBucket(): Promise<BucketResponse> {
    try {
      const response = await this.makeRequest<BucketResponse>("/v1/bucket");
      return response;
    } catch (error) {
      console.error("Error getting bucket:", error);
      // Return empty bucket on error
      return {
        toys: [],
        total_value: 0,
        total_items: 0,
      };
    }
  }

  // Add toy to bucket
  async addToBucket(toyId: number, quantity: number = 1): Promise<void> {
    try {
      await this.makeRequest("/v1/bucket", {
        method: "POST",
        body: JSON.stringify({
          toy_id: toyId,
          quantity: quantity,
        }),
      });

      console.log(
        `Successfully added toy ${toyId} (qty: ${quantity}) to bucket`
      );
    } catch (error) {
      console.error("Error adding to bucket:", error);
      throw new Error("Failed to add item to bucket");
    }
  }

  // Remove toys from bucket
  async removeFromBucket(toyIds: number[]): Promise<void> {
    try {
      await this.makeRequest("/v1/bucket/{toyIds}", {
        method: "DELETE",
        body: JSON.stringify({
          toy_ids: toyIds,
        }),
      });

      console.log(`Successfully removed toys ${toyIds.join(", ")} from bucket`);
    } catch (error) {
      console.error("Error removing from bucket:", error);
      throw new Error("Failed to remove items from bucket");
    }
  }

  // Clear entire bucket
  async clearBucket(): Promise<void> {
    try {
      await this.makeRequest("/v1/bucket/clear", {
        method: "DELETE",
      });

      console.log("Successfully cleared bucket");
    } catch (error) {
      console.error("Error clearing bucket:", error);
      throw new Error("Failed to clear bucket");
    }
  }

  // Update toy quantity in bucket
  async updateQuantity(toyId: number, quantity: number): Promise<void> {
    try {
      await this.makeRequest("/v1/bucket/update", {
        method: "PUT",
        body: JSON.stringify({
          toy_id: toyId,
          quantity: quantity,
        }),
      });

      console.log(`Successfully updated toy ${toyId} quantity to ${quantity}`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw new Error("Failed to update item quantity");
    }
  }

  // Process bucket (convert to rental)
  async processBucket(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        message: string;
      }>("/v1/bucket/process", {
        method: "POST",
      });

      console.log("Bucket processed successfully:", response);
      return response;
    } catch (error) {
      console.error("Error processing bucket:", error);
      throw new Error("Failed to process bucket");
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    service: string;
    version: string;
  }> {
    try {
      const response = await this.makeRequest<{
        status: string;
        service: string;
        version: string;
      }>("/health");
      return response;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const bucketService = new BucketService();

// Export types for use in components
export type { BucketToy, BucketResponse, AddToyRequest, RemoveToyRequest };
