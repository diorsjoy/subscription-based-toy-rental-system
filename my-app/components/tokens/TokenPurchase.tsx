"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Smartphone,
  Building2,
  Gift,
  Star,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTokens } from "@/components/providers/token-provider";
import { useToast } from "@/hooks/use-toast";

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  bonus: number;
  popular: boolean;
  savings?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  fee: number;
  processingTime: string;
}

export function TokenPurchase() {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("kaspi");
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { purchaseTokens } = useTokens();
  const { toast } = useToast();

  const packages: TokenPackage[] = [
    {
      id: "starter",
      tokens: 100,
      price: 1000,
      bonus: 0,
      popular: false,
    },
    {
      id: "popular",
      tokens: 250,
      price: 2250,
      bonus: 25,
      popular: true,
      savings: 250,
    },
    {
      id: "value",
      tokens: 500,
      price: 4500,
      bonus: 100,
      popular: false,
      savings: 1000,
    },
    {
      id: "premium",
      tokens: 1000,
      price: 8500,
      bonus: 350,
      popular: false,
      savings: 2850,
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "kaspi",
      name: "Kaspi Pay",
      icon: Smartphone,
      fee: 0,
      processingTime: "Instant",
    },
    {
      id: "halyk",
      name: "Halyk Bank",
      icon: Building2,
      fee: 1.5,
      processingTime: "1-3 min",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      fee: 2,
      processingTime: "1-5 min",
    },
  ];

  const getSelectedPackage = () => {
    return packages.find((pkg) => pkg.id === selectedPackage);
  };

  const calculateTotal = () => {
    if (isCustom) {
      const tokens = Math.floor(customAmount / 10);
      const selectedMethod = paymentMethods.find(
        (m) => m.id === selectedPayment
      );
      const fee = selectedMethod
        ? (customAmount * selectedMethod.fee) / 100
        : 0;
      return {
        tokens,
        bonus: 0,
        price: customAmount,
        fee: Math.round(fee),
        total: customAmount + fee,
      };
    }

    const pkg = getSelectedPackage();
    if (!pkg) return null;

    const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment);
    const fee = selectedMethod ? (pkg.price * selectedMethod.fee) / 100 : 0;

    return {
      tokens: pkg.tokens,
      bonus: pkg.bonus,
      price: pkg.price,
      fee: Math.round(fee),
      total: pkg.price + fee,
    };
  };

  const handlePurchase = async () => {
    const calculation = calculateTotal();
    if (!calculation) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For custom amounts, we don't have a packageId, so we'll use "custom"
      const packageId = isCustom ? "custom" : selectedPackage;

      const success = await purchaseTokens(
        packageId,
        selectedPayment,
        calculation.tokens + calculation.bonus
      );

      if (success) {
        toast({
          title: "Purchase Successful! 🎉",
          description: `${
            calculation.tokens + calculation.bonus
          } tokens added to your account.`,
        });

        // Reset form
        setSelectedPackage("");
        setIsCustom(false);
        setCustomAmount(0);
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculation = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Package Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Token Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={isCustom ? "custom" : selectedPackage}
            onValueChange={(value) => {
              if (value === "custom") {
                setIsCustom(true);
                setSelectedPackage("");
              } else {
                setIsCustom(false);
                setSelectedPackage(value);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="relative">
                  <label
                    htmlFor={pkg.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackage === pkg.id && !isCustom
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value={pkg.id}
                      id={pkg.id}
                      className="sr-only"
                    />

                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {pkg.tokens + pkg.bonus}
                      </div>
                      <div className="text-sm text-gray-500">Tokens</div>

                      {pkg.bonus > 0 && (
                        <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-medium mt-1">
                          <Gift className="h-3 w-3" />+{pkg.bonus} bonus
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="text-xl font-semibold">
                          ₸{pkg.price.toLocaleString()}
                        </div>
                        {pkg.savings && (
                          <div className="text-xs text-green-600">
                            Save ₸{pkg.savings}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {/* Custom Amount Option */}
            <div className="mt-4">
              <label
                htmlFor="custom"
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  isCustom
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="sr-only"
                />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Custom Amount</div>
                    <div className="text-sm text-gray-500">
                      Choose your own amount (minimum ₸100)
                    </div>
                  </div>

                  {isCustom && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-amount" className="text-sm">
                        ₸
                      </Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="100"
                        max="50000"
                        value={customAmount}
                        onChange={(e) =>
                          setCustomAmount(parseInt(e.target.value) || 0)
                        }
                        className="w-24"
                        placeholder="1000"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPayment}
            onValueChange={setSelectedPayment}
          >
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;

                return (
                  <label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      className="mr-3"
                    />

                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">
                          {method.processingTime} •{" "}
                          {method.fee === 0 ? "No fees" : `${method.fee}% fee`}
                        </div>
                      </div>

                      {selectedPayment === method.id && (
                        <Check className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Summary */}
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens:</span>
                <span className="font-medium">{calculation.tokens}</span>
              </div>

              {calculation.bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus tokens:</span>
                  <span className="font-medium text-green-600">
                    +{calculation.bonus}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₸{calculation.price.toLocaleString()}
                </span>
              </div>

              {calculation.fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing fee:</span>
                  <span className="font-medium">₸{calculation.fee}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₸{calculation.total.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>You&apos;ll receive:</span>
              <span className="font-medium">
                {calculation.tokens + calculation.bonus} tokens
              </span>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={
                (!selectedPackage && !isCustom) ||
                isProcessing ||
                (isCustom && customAmount < 100)
              }
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Tokens
                </>
              )}
            </Button>

            {isCustom && customAmount < 100 && customAmount > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                <AlertCircle className="h-4 w-4" />
                Minimum purchase amount is ₸100
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
