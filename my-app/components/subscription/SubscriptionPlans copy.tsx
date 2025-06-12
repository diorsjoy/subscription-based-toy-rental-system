// components/subscription/SubscriptionPlans.tsx - Complete component
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { PlanCard } from "./PlanCard";
import { SubscriptionFlow } from "./SubscriptionFlow"; // Make sure this imports the fixed version
import { useRouter } from "next/navigation";
import { subscriptionApi } from "@/services/subscriptionApi";

interface Plan {
  planId: number; // Backend uses camelCase
  name: string;
  description: string;
  rentalLimit: number; // Backend uses camelCase
  price: number;
  duration: string | number;
}

interface Subscription {
  user_id: number;
  planId: number;
  plan_name: string;
  remaining_limit: number;
  expires_at: string;
}

interface SubscriptionStatus {
  sub_status: boolean;
}

export const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showFlow, setShowFlow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock authentication state - replace with your actual auth hook
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
    // Simulate checking auth state
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [plansResponse, subscriptionStatus] = await Promise.all([
        subscriptionApi.getPlans(),
        subscriptionApi.checkSubscription(),
      ]);

      setPlans(plansResponse.plans);

      if (subscriptionStatus.sub_status) {
        const subscription = await subscriptionApi.getSubscriptionDetails();
        setCurrentSubscription(subscription);
      } else {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
      setError("Failed to load subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: number) => {
    if (!isAuthenticated) {
      // Redirect to auth page
      router.push("/auth");
      return;
    }

    const plan = plans.find((p) => p.planId === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowFlow(true);
    }
  };

  const handleConfirmSubscription = async (
    planId: number
  ): Promise<boolean> => {
    try {
      if (currentSubscription) {
        const result = await subscriptionApi.changePlan(planId);
        if (result.success) {
          await loadData(); // Reload subscription data
          return true;
        }
      } else {
        const result = await subscriptionApi.subscribe(planId);
        if (result.success) {
          await loadData(); // Reload subscription data
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Subscription error:", error);
      setError(error instanceof Error ? error.message : "Subscription failed");
      return false;
    }
  };

  const handleBackToPlans = () => {
    setShowFlow(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Button onClick={loadData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show subscription flow if a plan is selected
  if (showFlow && selectedPlan) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToPlans} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </div>
        <SubscriptionFlow
          selectedPlan={selectedPlan}
          isAuthenticated={isAuthenticated}
          hasCurrentSubscription={!!currentSubscription}
          onBack={handleBackToPlans}
          onConfirm={handleConfirmSubscription}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect subscription plan for your toy rental needs. All
          plans include access to our premium toy collection with flexible
          rental periods.
        </p>
      </div>

      {/* Current subscription banner */}
      {currentSubscription && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-green-800">Current Subscription</span>
              <Badge className="bg-green-600">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Plan:</span>{" "}
                {currentSubscription.plan_name}
              </div>
              <div>
                <span className="font-medium">Remaining:</span>{" "}
                {currentSubscription.remaining_limit} rentals
              </div>
              <div>
                <span className="font-medium">Expires:</span>{" "}
                {new Date(currentSubscription.expires_at).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authentication prompt for non-authenticated users */}
      {!isAuthenticated && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Ready to start your toy rental journey?
            </h3>
            <p className="text-blue-800 mb-4">
              Sign in or create an account to choose your subscription plan and
              start exploring our amazing toy collection.
            </p>
            <Button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.planId}
            plan={plan}
            isCurrentPlan={currentSubscription?.planId === plan.planId}
            isAuthenticated={isAuthenticated}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* Additional information */}
      <div className="mt-12 text-center">
        <Card className="bg-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">All Plans Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-gray-600">Right to your door</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <p className="font-medium">Quality Guarantee</p>
                <p className="text-gray-600">Clean & sanitized toys</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <p className="font-medium">Flexible Returns</p>
                <p className="text-gray-600">Return anytime</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-orange-600 font-bold">✓</span>
                </div>
                <p className="font-medium">Customer Support</p>
                <p className="text-gray-600">24/7 assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Can I change my plan anytime?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect at your next billing cycle.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                What happens if I exceed my rental limit?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You can either wait for your next billing cycle or upgrade your
                plan to continue renting toys immediately.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How does delivery work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We offer free delivery and pickup for all plans. Toys are
                delivered within 2-3 business days in most areas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Can I cancel my subscription?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes, you can cancel anytime. Your subscription remains active
                until the end of your current billing period.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
