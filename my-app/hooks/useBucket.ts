// hooks/useBucket.ts
import { useState, useEffect, useCallback } from "react";
import {
  bucketService,
  BucketContents,
  ToyItem,
} from "@/services/bucketService";

export const useBucket = (token: string | null) => {
  const [bucket, setBucket] = useState<BucketContents>({
    toys: [],
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBucket = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const bucketData = await bucketService.getBucket();
      setBucket(bucketData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load bucket";
      setError(errorMessage);
      console.error("Error loading bucket:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBucket();
  }, [loadBucket]);

  const addToBucket = async (toys: ToyItem[]) => {
    if (!token) throw new Error("No token available");

    try {
      const response = await bucketService.addToBucket(toys);
      if (response.status === "STATUS_OK") {
        await loadBucket();
        return { success: true, message: response.msg };
      } else {
        throw new Error(response.msg || "Failed to add to bucket");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add to bucket";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeFromBucket = async (toyIds: number[]) => {
    if (!token) throw new Error("No token available");

    try {
      const response = await bucketService.removeFromBucket(toyIds);
      if (response.status === "STATUS_OK") {
        await loadBucket();
        return { success: true, message: response.msg };
      } else {
        throw new Error(response.msg || "Failed to remove from bucket");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove from bucket";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearBucket = async () => {
    const toyIds = bucket.toys.map((toy) => toy.toy_id);
    if (toyIds.length > 0) {
      return removeFromBucket(toyIds);
    }
    return { success: true, message: "Bucket already empty" };
  };

  return {
    bucket,
    loading,
    error,
    addToBucket,
    removeFromBucket,
    clearBucket,
    loadBucket,
  };
};
