// services/toyService.ts
interface Toy {
  id: number;
  name: string;
  description: string;
  price: number; // Price in KZT
  category: string;
  ageRange: string;
  imageUrl: string;
  availability: boolean;
  rating?: number;
  brand?: string;
}

interface RentalItem {
  id: number;
  toyId: number;
  userId: number;
  startDate: string;
  endDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue";
  extensionCount?: number;
  toy?: Toy; // Populated toy details
}

class ToyService {
  private static instance: ToyService;
  private baseUrl: string;
  private cache: Map<number, Toy> = new Map();

  private constructor() {
    // Use the same base URL as your browse page or toy API
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL ||
      "http://localhost:8080";
  }

  public static getInstance(): ToyService {
    if (!ToyService.instance) {
      ToyService.instance = new ToyService();
    }
    return ToyService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get toy details by ID - matching your backend structure
  async getToyById(toyId: number): Promise<Toy> {
    // Check cache first
    if (this.cache.has(toyId)) {
      return this.cache.get(toyId)!;
    }

    try {
      console.log(`🎯 Fetching toy details for ID: ${toyId}`);

      // Try the toys endpoint (adjust URL based on your actual API)
      const response = await fetch(`${this.baseUrl}/v1/toys/${toyId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.warn(`Failed to fetch toy ${toyId}: ${response.statusText}`);
        throw new Error(`Failed to fetch toy: ${response.statusText}`);
      }

      const toyData = await response.json();
      console.log(`✅ Retrieved toy data for ${toyId}:`, toyData);

      // Map your backend fields to the Toy interface
      const toy: Toy = {
        id: toyData.id || toyId,
        name: toyData.title || toyData.name || `Toy #${toyId}`,
        description: toyData.desc || toyData.description || "",
        price: toyData.value || toyData.price || toyData.tokens || 0,
        category: toyData.categories?.[0] || toyData.category || "Toys",
        ageRange: toyData.recommendedAge || toyData.ageRange || "All ages",
        imageUrl:
          toyData.images?.[0] || toyData.imageUrl || toyData.image_url || "",
        availability: toyData.isAvailable !== false,
        rating: toyData.rating,
        brand: toyData.manufacturer || toyData.brand || "",
      };

      // Cache the result
      this.cache.set(toyId, toy);

      return toy;
    } catch (error) {
      console.error(`❌ Error fetching toy ${toyId}:`, error);

      // Return fallback data if API fails
      const fallbackToy: Toy = {
        id: toyId,
        name: `Toy #${toyId}`,
        description: "Toy details unavailable",
        price: 0,
        category: "Unknown",
        ageRange: "Unknown",
        imageUrl: "",
        availability: false,
      };

      // Don't cache fallback data
      return fallbackToy;
    }
  }

  // Get multiple toys by IDs (batch request or individual requests)
  async getToysByIds(toyIds: number[]): Promise<Toy[]> {
    console.log(`🎯 Fetching multiple toys:`, toyIds);

    const uncachedIds = toyIds.filter((id) => !this.cache.has(id));

    if (uncachedIds.length === 0) {
      return toyIds.map((id) => this.cache.get(id)!);
    }

    try {
      // Try batch request first
      const response = await fetch(`${this.baseUrl}/v1/toys/batch`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ toyIds: uncachedIds }),
      });

      if (response.ok) {
        const toys: any[] = await response.json();

        // Map and cache the results
        const mappedToys = toys.map((toyData) => {
          const toy: Toy = {
            id: toyData.id,
            name: toyData.title || toyData.name || `Toy #${toyData.id}`,
            description: toyData.desc || toyData.description || "",
            price: toyData.value || toyData.price || toyData.tokens || 0,
            category: toyData.categories?.[0] || toyData.category || "Toys",
            ageRange: toyData.recommendedAge || toyData.ageRange || "All ages",
            imageUrl:
              toyData.images?.[0] ||
              toyData.imageUrl ||
              toyData.image_url ||
              "",
            availability: toyData.isAvailable !== false,
            rating: toyData.rating,
            brand: toyData.manufacturer || toyData.brand || "",
          };

          this.cache.set(toy.id, toy);
          return toy;
        });

        // Return all requested toys (cached + newly fetched)
        return toyIds.map(
          (id) =>
            this.cache.get(id) || {
              id,
              name: `Toy #${id}`,
              description: "Toy details unavailable",
              price: 0,
              category: "Unknown",
              ageRange: "Unknown",
              imageUrl: "",
              availability: false,
            }
        );
      }
    } catch (error) {
      console.warn(
        "Batch request failed, falling back to individual requests:",
        error
      );
    }

    // Fallback: Make individual requests
    try {
      const toyPromises = uncachedIds.map((id) => this.getToyById(id));
      const newToys = await Promise.all(toyPromises);

      // Return all requested toys
      return toyIds.map((id) => {
        const cachedToy = this.cache.get(id);
        if (cachedToy) return cachedToy;

        const newToy = newToys.find((toy) => toy.id === id);
        return (
          newToy || {
            id,
            name: `Toy #${id}`,
            description: "Toy details unavailable",
            price: 0,
            category: "Unknown",
            ageRange: "Unknown",
            imageUrl: "",
            availability: false,
          }
        );
      });
    } catch (error) {
      console.error("Error fetching toys:", error);

      // Return fallback data for all toys if everything fails
      return toyIds.map((id) => ({
        id,
        name: `Toy #${id}`,
        description: "Toy details unavailable",
        price: 0,
        category: "Unknown",
        ageRange: "Unknown",
        imageUrl: "",
        availability: false,
      }));
    }
  }

  // Get user's current rentals with toy details
  async getCurrentRentals(userId: number): Promise<RentalItem[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/rentals/user/${userId}/current`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch rentals: ${response.statusText}`);
      }

      const rentals: RentalItem[] = await response.json();

      // Fetch toy details for each rental
      const toyIds = rentals.map((rental) => rental.toyId);
      const toys = await this.getToysByIds(toyIds);

      // Attach toy details to rentals
      return rentals.map((rental) => ({
        ...rental,
        toy: toys.find((toy) => toy.id === rental.toyId),
      }));
    } catch (error) {
      console.error("Error fetching current rentals:", error);
      return [];
    }
  }

  // Get user's rental history with toy details
  async getRentalHistory(userId: number): Promise<RentalItem[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/rentals/user/${userId}/history`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch rental history: ${response.statusText}`
        );
      }

      const rentals: RentalItem[] = await response.json();

      // Fetch toy details for each rental
      const toyIds = rentals.map((rental) => rental.toyId);
      const toys = await this.getToysByIds(toyIds);

      // Attach toy details to rentals
      return rentals.map((rental) => ({
        ...rental,
        toy: toys.find((toy) => toy.id === rental.toyId),
      }));
    } catch (error) {
      console.error("Error fetching rental history:", error);
      return [];
    }
  }

  // Extend rental period
  async extendRental(rentalId: number, days: number = 7): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/rentals/${rentalId}/extend`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ extensionDays: days }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to extend rental: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success || true;
    } catch (error) {
      console.error("Error extending rental:", error);
      return false;
    }
  }

  // Clear cache (useful when toy details are updated)
  clearCache(): void {
    this.cache.clear();
  }

  // Clear specific toy from cache
  clearToyCache(toyId: number): void {
    this.cache.delete(toyId);
  }
}

export default ToyService;
export type { Toy, RentalItem };
