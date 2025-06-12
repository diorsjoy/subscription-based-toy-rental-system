// hooks/useBucket.ts
import { useState, useEffect, useCallback } from "react";
import {
  bucketService,
  type BucketToy,
  type BucketResponse,
} from "@/services/bucketService";
import { useAuth } from "@/lib/contexts/AuthContext";

interface UseBucketReturn {
  // State
  bucket: BucketResponse;
  loading: boolean;
  error: string | null;

  // Computed values
  isEmpty: boolean;
  totalValue: number;
  totalItems: number;

  // Methods
  addToBucket: (toyId: number, quantity?: number) => Promise<void>;
  removeFromBucket: (toyIds: number[]) => Promise<void>;
  updateQuantity: (toyId: number, quantity: number) => Promise<void>;
  clearBucket: () => Promise<void>;
  processBucket: () => Promise<{ success: boolean; message: string }>;
  refreshBucket: () => Promise<void>;
}

export const useBucket = (): UseBucketReturn => {
  const { isAuthenticated } = useAuth();
  const [bucket, setBucket] = useState<BucketResponse>({
    toys: [],
    total_value: 0,
    total_items: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load bucket data
  const loadBucket = useCallback(async () => {
    if (!isAuthenticated) {
      setBucket({ toys: [], total_value: 0, total_items: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Loading bucket data...");
      const bucketData = await bucketService.getBucket();
      console.log("Bucket data loaded:", bucketData);

      setBucket(bucketData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load bucket";
      console.error("Error loading bucket:", errorMessage);
      setError(errorMessage);

      // Set empty bucket on error
      setBucket({ toys: [], total_value: 0, total_items: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add item to bucket
  const addToBucket = useCallback(
    async (toyId: number, quantity: number = 1) => {
      try {
        setError(null);
        console.log(`Adding toy ${toyId} with quantity ${quantity} to bucket`);

        await bucketService.addToBucket(toyId, quantity);
        await loadBucket(); // Refresh bucket after adding

        console.log("Item added to bucket successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add item to bucket";
        console.error("Error adding to bucket:", errorMessage);
        setError(errorMessage);
        throw err;
      }
    },
    [loadBucket]
  );

  // Remove items from bucket
  const removeFromBucket = useCallback(
    async (toyIds: number[]) => {
      try {
        setError(null);
        console.log(`Removing toys ${toyIds.join(", ")} from bucket`);

        await bucketService.removeFromBucket(toyIds);
        await loadBucket(); // Refresh bucket after removing

        console.log("Items removed from bucket successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to remove items from bucket";
        console.error("Error removing from bucket:", errorMessage);
        setError(errorMessage);
        throw err;
      }
    },
    [loadBucket]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (toyId: number, quantity: number) => {
      try {
        setError(null);
        console.log(`Updating toy ${toyId} quantity to ${quantity}`);

        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          await removeFromBucket([toyId]);
        } else {
          await bucketService.updateQuantity(toyId, quantity);
          await loadBucket(); // Refresh bucket after updating
        }

        console.log("Quantity updated successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update quantity";
        console.error("Error updating quantity:", errorMessage);
        setError(errorMessage);
        throw err;
      }
    },
    [loadBucket, removeFromBucket]
  );

  // Clear entire bucket
  const clearBucket = useCallback(async () => {
    try {
      setError(null);
      console.log("Clearing bucket");

      await bucketService.clearBucket();
      setBucket({ toys: [], total_value: 0, total_items: 0 });

      console.log("Bucket cleared successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear bucket";
      console.error("Error clearing bucket:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Process bucket (convert to rental)
  const processBucket = useCallback(async () => {
    try {
      setError(null);
      console.log("Processing bucket");

      const result = await bucketService.processBucket();

      if (result.success) {
        // Clear bucket after successful processing
        setBucket({ toys: [], total_value: 0, total_items: 0 });
      }

      console.log("Bucket processed:", result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process bucket";
      console.error("Error processing bucket:", errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Refresh bucket data
  const refreshBucket = useCallback(async () => {
    await loadBucket();
  }, [loadBucket]);

  // Load bucket on mount and when authentication changes
  useEffect(() => {
    loadBucket();
  }, [loadBucket]);

  // Computed values
  const isEmpty = bucket.toys.length === 0;
  const totalValue = bucket.total_value;
  const totalItems = bucket.total_items;

  return {
    // State
    bucket,
    loading,
    error,

    // Computed values
    isEmpty,
    totalValue,
    totalItems,

    // Methods
    addToBucket,
    removeFromBucket,
    updateQuantity,
    clearBucket,
    processBucket,
    refreshBucket,
  };
};
