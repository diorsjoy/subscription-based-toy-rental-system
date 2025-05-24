"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Star,
  MoreVertical,
  Package,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RentalExtensionModal } from "./RentalExtensionModal";
import { RentalStatusTimeline } from "./RentalStatusTimeline";
import Image from "next/image";

interface Rental {
  id: string;
  toyId: number;
  toyName: string;
  toyImage: string;
  startDate: string;
  endDate: string;
  status: "active" | "returned" | "overdue" | "extending";
  tokens: number;
  rating?: number;
}

interface RentalItemListProps {
  rentals: Rental[];
  showActions?: boolean;
  onReturn?: (rentalId: string) => void;
  onRate?: (rentalId: string, rating: number) => void;
}

export function RentalItemList({
  rentals,
  showActions = true,
  onReturn,
  onRate,
}: RentalItemListProps) {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "extending":
        return "bg-yellow-100 text-yellow-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExtension = (rental: Rental) => {
    setSelectedRental(rental);
    setShowExtensionModal(true);
  };

  const handleViewTimeline = (rental: Rental) => {
    setSelectedRental(rental);
    setShowTimelineModal(true);
  };

  if (rentals.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No rentals found
        </h3>
        <p className="text-gray-500">You haven&apos;t rented any toys yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {rentals.map((rental) => {
          const daysRemaining = getDaysRemaining(rental.endDate);

          return (
            <Card key={rental.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={rental.toyImage}
                      alt={rental.toyName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {rental.toyName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {rental.tokens} tokens • Rental ID: #
                          {rental.id.slice(-6)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(rental.status)}>
                          {rental.status.charAt(0).toUpperCase() +
                            rental.status.slice(1)}
                        </Badge>

                        {showActions && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTimeline(rental)}
                              >
                                View Timeline
                              </DropdownMenuItem>
                              {rental.status === "active" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleExtension(rental)}
                                  >
                                    Extend Rental
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onReturn?.(rental.id)}
                                    className="text-red-600"
                                  >
                                    Return Toy
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(rental.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(rental.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {rental.status === "active" && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span
                          className={`text-sm ${
                            daysRemaining <= 3
                              ? "text-red-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {daysRemaining > 0
                            ? `${daysRemaining} days remaining`
                            : `${Math.abs(daysRemaining)} days overdue`}
                        </span>
                      </div>
                    )}

                    {rental.status === "returned" && rental.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          Rated {rental.rating}/5 stars
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RentalExtensionModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        rental={selectedRental}
      />

      <RentalStatusTimeline
        isOpen={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
        rental={selectedRental}
      />
    </>
  );
}
