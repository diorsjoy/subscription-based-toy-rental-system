// components/rental/RentalProcessingFlow.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useBucket } from "@/hooks/useBucket";
import { subscriptionApi } from "@/services/subscriptionApi";

interface RentalProcessingFlowProps {
  token: string;
  onBack: () => void;
  onComplete: () => void;
}

export const RentalProcessingFlow: React.FC<RentalProcessingFlowProps> = ({
  token,
  onBack,
  onComplete,
}) => {
  const { bucket, clearBucket } = useBucket(token);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCost = bucket.toys.reduce(
    (sum, toy) => sum + toy.value * toy.quantity,
    0
  );

  const processRental = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Extract tokens from subscription balance
      const extractResponse = await subscriptionApi.extractFromBalance(
        totalCost
      );

      if (!extractResponse.success) {
        throw new Error(extractResponse.message || "Failed to process payment");
      }

      // Clear the bucket
      await clearBucket();

      // Mark as completed
      setCompleted(true);

      // Redirect after a delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Rental Successful!
          </h2>
          <p className="text-gray-600">
            Your toys have been rented successfully.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Complete Your Rental</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rental Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bucket.toys.map((toy) => (
                <div
                  key={toy.toy_id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{toy.name}</p>
                    <p className="text-sm text-gray-500">Qty: {toy.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {toy.value * toy.quantity} tokens
                  </p>
                </div>
              ))}

              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{totalCost} tokens</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                <p className="font-medium">Subscription Balance</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={processRental}
                disabled={processing}
                className="w-full"
              >
                {processing
                  ? "Processing..."
                  : `Confirm Rental - ${totalCost} tokens`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
