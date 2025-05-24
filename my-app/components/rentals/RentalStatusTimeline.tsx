"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Package,
  Calendar,
  Star,
  ArrowRight,
} from "lucide-react";

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

interface RentalStatusTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  rental: Rental | null;
}

export function RentalStatusTimeline({
  isOpen,
  onClose,
  rental,
}: RentalStatusTimelineProps) {
  if (!rental) return null;

  const getTimelineEvents = () => {
    const events = [
      {
        id: 1,
        title: "Rental Started",
        description: `Toy rental began on ${new Date(
          rental.startDate
        ).toLocaleDateString()}`,
        date: rental.startDate,
        icon: Package,
        status: "completed",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
    ];

    // Add current status event
    const today = new Date();
    const endDate = new Date(rental.endDate);
    const startDate = new Date(rental.startDate);
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (rental.status === "active") {
      const daysRemaining = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      events.push({
        id: 2,
        title: daysRemaining > 0 ? "Currently Active" : "Overdue",
        description:
          daysRemaining > 0
            ? `${daysRemaining} days remaining (${daysElapsed}/${totalDays} days used)`
            : `${Math.abs(daysRemaining)} days overdue`,
        date: today.toISOString().split("T")[0],
        icon: daysRemaining > 0 ? Clock : Calendar,
        status: "current",
        color: daysRemaining > 0 ? "text-blue-600" : "text-red-600",
        bgColor: daysRemaining > 0 ? "bg-blue-100" : "bg-red-100",
      });

      events.push({
        id: 3,
        title: "Scheduled Return",
        description: `Toy should be returned by ${endDate.toLocaleDateString()}`,
        date: rental.endDate,
        icon: ArrowRight,
        status: "pending",
        color: "text-gray-400",
        bgColor: "bg-gray-100",
      });
    } else if (rental.status === "extending") {
      events.push({
        id: 2,
        title: "Extension in Progress",
        description: "Rental period is being extended",
        date: today.toISOString().split("T")[0],
        icon: Clock,
        status: "current",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      });
    } else if (rental.status === "returned") {
      events.push({
        id: 2,
        title: "Toy Returned",
        description: `Toy was returned successfully${
          rental.rating ? ` • Rated ${rental.rating}/5 stars` : ""
        }`,
        date: rental.endDate,
        icon: CheckCircle,
        status: "completed",
        color: "text-green-600",
        bgColor: "bg-green-100",
      });
    }

    return events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const timelineEvents = getTimelineEvents();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "extending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Extending</Badge>
        );
      case "returned":
        return <Badge className="bg-gray-100 text-gray-800">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rental Timeline</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rental Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">{rental.toyName}</h4>
              <p className="text-sm text-muted-foreground">
                Rental ID: #{rental.id.slice(-6)} • {rental.tokens} tokens
              </p>
            </div>
            {getStatusBadge(rental.status)}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon;
              const isLast = index === timelineEvents.length - 1;

              return (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${event.bgColor}`}
                    >
                      <IconComponent className={`h-5 w-5 ${event.color}`} />
                    </div>
                    {!isLast && <div className="w-px h-8 bg-gray-200 mt-2" />}
                  </div>

                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      {event.status === "current" && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          {rental.status === "returned" && rental.rating && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">Your Rating</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= rental.rating!
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
