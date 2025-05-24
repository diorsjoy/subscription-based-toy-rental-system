"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Package, Clock, Calendar } from "lucide-react";
import { useRentals } from "@/components/providers/rental-provider";
import { RentalItemList } from "@/components/rentals/RentalItemList";

export function RentalManagement() {
  const { currentRentals, rentalHistory, returnRental, isLoading } =
    useRentals();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<string>("");
  const [returnRating, setReturnRating] = useState(5);
  const [returnFeedback, setReturnFeedback] = useState("");
  const [isReturning, setIsReturning] = useState(false);

  const handleReturnClick = (rentalId: string) => {
    setSelectedRentalId(rentalId);
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedRentalId) return;

    setIsReturning(true);
    const success = await returnRental(selectedRentalId, returnRating);

    if (success) {
      setShowReturnModal(false);
      setSelectedRentalId("");
      setReturnRating(5);
      setReturnFeedback("");
    }
    setIsReturning(false);
  };

  const handleStarClick = (rating: number) => {
    setReturnRating(rating);
  };

  const getOverdueRentals = () => {
    const today = new Date();
    return currentRentals.filter((rental) => {
      const endDate = new Date(rental.endDate);
      return endDate < today && rental.status === "active";
    });
  };

  const getSoonToExpireRentals = () => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    return currentRentals.filter((rental) => {
      const endDate = new Date(rental.endDate);
      return (
        endDate <= threeDaysFromNow &&
        endDate >= today &&
        rental.status === "active"
      );
    });
  };

  const overdueRentals = getOverdueRentals();
  const soonToExpireRentals = getSoonToExpireRentals();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Rentals
                </p>
                <p className="text-2xl font-bold">{currentRentals.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overdue
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueRentals.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Rented
                </p>
                <p className="text-2xl font-bold">{rentalHistory.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {overdueRentals.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Overdue Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              You have {overdueRentals.length} overdue rental(s). Please return
              them to avoid additional fees.
            </p>
            <div className="space-y-2">
              {overdueRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md"
                >
                  <span className="font-medium">{rental.toyName}</span>
                  <Badge variant="destructive">
                    {Math.abs(
                      Math.ceil(
                        (new Date().getTime() -
                          new Date(rental.endDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{" "}
                    days overdue
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {soonToExpireRentals.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-4">
              {soonToExpireRentals.length} rental(s) expiring within 3 days.
            </p>
            <div className="space-y-2">
              {soonToExpireRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md"
                >
                  <span className="font-medium">{rental.toyName}</span>
                  <Badge
                    variant="outline"
                    className="text-yellow-800 border-yellow-300"
                  >
                    {Math.ceil(
                      (new Date(rental.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rental Lists */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">
            Current Rentals ({currentRentals.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Rental History ({rentalHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <RentalItemList
                  rentals={currentRentals}
                  showActions={true}
                  onReturn={handleReturnClick}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
            </CardHeader>
            <CardContent>
              <RentalItemList rentals={rentalHistory} showActions={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Return Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Return Toy</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Rate your experience (1-5 stars)</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStarClick(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= returnRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="How was your experience with this toy?"
                value={returnFeedback}
                onChange={(e) => setReturnFeedback(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturnSubmit} disabled={isReturning}>
              {isReturning ? "Returning..." : "Return Toy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
