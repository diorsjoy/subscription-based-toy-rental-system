// components/subscription/PlanCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Users, Clock, ArrowRight } from "lucide-react";
import { formatDuration } from "@/types/subscription";

interface Plan {
  planId: number; // Backend uses camelCase
  name: string;
  description: string;
  rentalLimit: number; // Backend uses camelCase
  price: number;
  duration: string | number;
}

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  isAuthenticated: boolean;
  onSelect: (planId: number) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan = false,
  isAuthenticated,
  onSelect,
}) => {
  const isPremium = plan.name.toLowerCase().includes("premium");
  const isPopular = plan.name.toLowerCase().includes("family");

  const handleSelect = () => {
    onSelect(plan.planId); // Use camelCase field name
  };

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("kz-KZ");
  };

  const getBadgeContent = () => {
    if (isCurrentPlan) {
      return (
        <Badge className="bg-green-600 text-white">
          <Check className="w-3 h-3 mr-1" />
          Current Plan
        </Badge>
      );
    }
    if (isPremium) {
      return (
        <Badge className="bg-purple-600 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    if (isPopular) {
      return (
        <Badge className="bg-blue-600 text-white">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      );
    }
    return null;
  };

  const getCardStyles = () => {
    if (isCurrentPlan) {
      return "border-green-300 bg-green-50 shadow-lg";
    }
    if (isPremium) {
      return "border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg";
    }
    if (isPopular) {
      return "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105";
    }
    return "border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200";
  };

  const getButtonVariant = () => {
    if (isCurrentPlan) return "outline";
    if (isPremium) return "default";
    return "default";
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Sign In to Subscribe";
    if (isCurrentPlan) return "Current Plan";
    return "Choose Plan";
  };

  return (
    <Card
      className={`relative overflow-hidden h-full flex flex-col ${getCardStyles()}`}
    >
      {/* Badge positioned at top */}
      {getBadgeContent() && (
        <div className="absolute top-4 right-4 z-10">{getBadgeContent()}</div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span
            className={
              isPremium
                ? "text-purple-800"
                : isPopular
                ? "text-blue-800"
                : "text-gray-800"
            }
          >
            {plan.name}
          </span>
        </CardTitle>

        {plan.description && (
          <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">₸{plan.price}</div>
          <div className="text-sm text-gray-600">per month</div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isPremium
                  ? "bg-purple-100"
                  : isPopular
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <Users
                className={`w-4 h-4 ${
                  isPremium
                    ? "text-purple-600"
                    : isPopular
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {plan.rentalLimit} rentals
              </p>
              <p className="text-xs text-gray-500">
                per {formatDuration(plan.duration)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isPremium
                  ? "bg-purple-100"
                  : isPopular
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <Clock
                className={`w-4 h-4 ${
                  isPremium
                    ? "text-purple-600"
                    : isPopular
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {formatDuration(plan.duration)}
              </p>
              <p className="text-xs text-gray-500">Auto-renewal</p>
            </div>
          </div>

          {/* Additional features based on plan type */}
          {isPremium && (
            <>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">
                  Exclusive toys access
                </span>
              </div>
              {/* <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Free toy swaps</span>
              </div> */}
            </>
          )}

          {/* {(isPopular || isPremium) && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">
                Free same-day delivery
              </span>
            </div>
          )} */}

          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">
              Free pickup & delivery
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">
              Sanitized toys guaranteed
            </span>
          </div>
        </div>

        {/* Value proposition */}
        {isPopular && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">
              💰 Save 25% compared to individual rentals
            </p>
          </div>
        )}

        {/* {isPremium && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800 font-medium">
              🎁 Includes premium toys worth ₸50,000+
            </p>
          </div>
        )} */}

        {/* Action Button */}
        <Button
          onClick={handleSelect}
          disabled={isCurrentPlan}
          variant={getButtonVariant()}
          className={`w-full ${
            isPremium && !isCurrentPlan
              ? "bg-purple-600 hover:bg-purple-700"
              : isPopular && !isCurrentPlan
              ? "bg-blue-600 hover:bg-blue-700"
              : ""
          }`}
        >
          {getButtonText()}
          {!isCurrentPlan && !isAuthenticated && (
            <ArrowRight className="w-4 h-4 ml-2" />
          )}
        </Button>

        {/* Additional info for unauthenticated users */}
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center">
            Create an account to start your subscription
          </p>
        )}
      </CardContent>
    </Card>
  );
};
