// components/bucket/BucketDrawer.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trash2, ShoppingCart, Package } from "lucide-react";
import { useBucket } from "@/hooks/useBucket";
import { subscriptionApi } from "@/services/subscriptionApi";
import Image from "next/image";

interface BucketDrawerProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onProceedToRental: () => void;
}

export const BucketDrawer: React.FC<BucketDrawerProps> = ({
  token,
  isOpen,
  onClose,
  onProceedToRental,
}) => {
  const { bucket, loading, removeFromBucket, clearBucket } = useBucket(token);
  const [subscriptionDetails, setSubscriptionDetails] =
    React.useState<any>(null);

  React.useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        const details = await subscriptionApi.getSubscriptionDetails();
        setSubscriptionDetails(details);
      } catch (error) {
        console.error("Failed to load subscription details:", error);
      }
    };

    if (token) {
      loadSubscriptionDetails();
    }
  }, [token]);

  const totalCost = bucket.toys.reduce(
    (sum, toy) => sum + toy.value * toy.quantity,
    0
  );
  const canAfford = subscriptionDetails
    ? subscriptionDetails.remaining_limit >= totalCost
    : false;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Bucket
                {bucket.quantity > 0 && (
                  <Badge variant="secondary">{bucket.quantity}</Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : bucket.toys.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Your bucket is empty
                </h3>
                <p className="text-sm text-gray-500">
                  Browse toys and add them to your bucket
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {bucket.toys.map((toy) => (
                  <div
                    key={toy.toy_id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={toy.image_url || "/api/placeholder/64/64"}
                        alt={toy.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {toy.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {toy.quantity}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {toy.value * toy.quantity} tokens
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromBucket([toy.toy_id])}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {bucket.toys.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total Cost */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Cost:</span>
                <span className="font-bold text-lg">{totalCost} tokens</span>
              </div>

              {/* Balance Info */}
              {subscriptionDetails && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between">
                    <span>Available Balance:</span>
                    <span className="font-medium">
                      {subscriptionDetails.remaining_limit} tokens
                    </span>
                  </div>
                  {!canAfford && (
                    <p className="text-red-600 text-xs mt-1">
                      Need {totalCost - subscriptionDetails.remaining_limit}{" "}
                      more tokens
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={onProceedToRental}
                  disabled={!canAfford}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Proceed to Rental
                </Button>
                <Button
                  variant="outline"
                  onClick={clearBucket}
                  className="w-full"
                >
                  Clear Bucket
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
