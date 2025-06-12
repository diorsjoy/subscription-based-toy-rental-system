"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Check,
  ArrowLeft,
  Shield,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDuration } from "@/types/subscription";

interface Plan {
  planId: number; // Backend uses camelCase
  name: string;
  description: string;
  rentalLimit: number; // Backend uses camelCase
  price: number;
  duration: string | number;
}

interface SubscriptionFlowProps {
  selectedPlan: Plan;
  isAuthenticated: boolean;
  hasCurrentSubscription: boolean;
  onBack: () => void;
  onConfirm: (planId: number) => Promise<boolean>;
}

export const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({
  selectedPlan,
  isAuthenticated,
  hasCurrentSubscription,
  onBack,
  onConfirm,
}) => {
  const [step, setStep] = useState<
    "confirm" | "payment" | "processing" | "success"
  >("confirm");
  const [paymentMethod, setPaymentMethod] = useState<"kaspi" | "card">("kaspi");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    setStep("payment");
  };

  const handlePayment = async () => {
    setStep("processing");
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = await onConfirm(selectedPlan.planId);

      if (success) {
        setStep("success");
      } else {
        setStep("payment");
        // Error handling would be done in the parent component
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {hasCurrentSubscription ? "Change Your Plan" : "Subscribe Now"}
        </h2>
        <p className="text-gray-600">
          {hasCurrentSubscription
            ? "You are changing to a new subscription plan"
            : "You are about to subscribe to our toy rental service"}
        </p>
      </div>

      {/* Selected Plan Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-blue-900">
                {selectedPlan.name}
              </h3>
              <p className="text-blue-700">{selectedPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                ₸{selectedPlan.price.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">
                per {formatDuration(selectedPlan.duration)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{selectedPlan.rentalLimit} rentals</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{formatDuration(selectedPlan.duration)}duration</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Free delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>24/7 support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">What you get:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Access to 500+ premium toys</li>
          <li>• Free delivery and pickup</li>
          <li>• Professional toy sanitization</li>
          <li>• Flexible rental periods</li>
          <li>• Customer support</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleConfirm} className="flex-1">
          {isAuthenticated
            ? hasCurrentSubscription
              ? "Change Plan"
              : "Continue to Payment"
            : "Login to Subscribe"}
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
        <p className="text-gray-600">
          Complete your subscription with secure payment
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            paymentMethod === "kaspi"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setPaymentMethod("kaspi")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">K</span>
              </div>
              <div>
                <h4 className="font-semibold">Kaspi Pay</h4>
                <p className="text-sm text-gray-600">Instant payment</p>
              </div>
            </div>
            {paymentMethod === "kaspi" && (
              <Check className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            paymentMethod === "card"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setPaymentMethod("card")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Credit/Debit Card</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard</p>
              </div>
            </div>
            {paymentMethod === "card" && (
              <Check className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Plan: {selectedPlan.name}</span>
            <span>₸{selectedPlan.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing fee</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₸{selectedPlan.price.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep("confirm")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handlePayment} className="flex-1" disabled={loading}>
          <CreditCard className="w-4 h-4 mr-2" />
          Pay ₸{selectedPlan.price.toLocaleString()}
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-gray-600">
          Please wait while we process your payment...
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2 text-green-800">
          {hasCurrentSubscription
            ? "Plan Changed Successfully!"
            : "Welcome to Oiyn Shak!"}
        </h2>
        <p className="text-gray-600">
          {hasCurrentSubscription
            ? "Your subscription plan has been updated successfully."
            : "Your subscription is now active. Start browsing toys!"}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">Next steps:</h4>
        <ul className="text-sm text-green-700 space-y-1 text-left">
          <li>• Browse our toy catalog</li>
          <li>• Start renting toys with your plan</li>
          <li>• Manage your subscription in your profile</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/profile")}
          className="flex-1"
        >
          View Profile
        </Button>
        <Button onClick={() => router.push("/browse")} className="flex-1">
          Browse Toys
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        {step === "confirm" && renderConfirmStep()}
        {step === "payment" && renderPaymentStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}
      </CardContent>
    </Card>
  );
};
