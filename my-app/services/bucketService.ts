interface BucketToy {
  toy_id: number;
  name: string;
  value: number;
  image_url: string;
  quantity: number;
}

interface BucketContents {
  toys: BucketToy[];
  quantity: number;
}

interface ToyItem {
  toy_id: number;
  quantity: number;
}

interface BucketResponse {
  status: string;
  msg: string;
}

class BucketService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL_BUCKET ||
      "http://localhost:2020";
  }

  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bucket API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async addToBucket(toys: ToyItem[]): Promise<BucketResponse> {
    return this.makeRequest("/v1/bucket/add", {
      method: "POST",
      body: JSON.stringify({ toys }),
    });
  }

  async removeFromBucket(toyIds: number[]): Promise<BucketResponse> {
    return this.makeRequest("/v1/bucket/delete", {
      method: "POST",
      body: JSON.stringify({ toy_id: toyIds }),
    });
  }

  async getBucket(): Promise<BucketContents> {
    return this.makeRequest("/v1/bucket/get", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  async createBucket(): Promise<BucketResponse> {
    return this.makeRequest("/v1/bucket/create", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }
}

export const bucketService = new BucketService();
export type { BucketToy, BucketContents, ToyItem, BucketResponse };
