"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

export function KazakhstanPaymentInfo() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentMethods = [
    {
      id: "kaspi",
      name: "Kaspi Pay",
      icon: Smartphone,
      description: "Instant payment via Kaspi Bank mobile app",
      processingTime: "Instant",
      fees: "Free",
      popular: true,
      features: [
        "QR code payment",
        "Mobile app integration",
        "Instant confirmation",
      ],
    },
    {
      id: "halyk",
      name: "Halyk Bank",
      icon: Building2,
      description: "Online banking and card payments",
      processingTime: "1-3 minutes",
      fees: "1.5%",
      popular: false,
      features: ["Online banking", "Debit/Credit cards", "Bank transfer"],
    },
    {
      id: "forte",
      name: "ForteBank",
      icon: CreditCard,
      description: "Secure card payments and transfers",
      processingTime: "1-5 minutes",
      fees: "2%",
      popular: false,
      features: ["Visa/Mastercard", "Online transfers", "Mobile banking"],
    },
    {
      id: "jusan",
      name: "Jusan Bank",
      icon: Building2,
      description: "Digital banking solutions",
      processingTime: "Instant",
      fees: "Free",
      popular: false,
      features: ["Digital wallet", "QR payments", "Mobile app"],
    },
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-level Security",
      description:
        "All transactions are encrypted and secured using banking standards",
    },
    {
      icon: CheckCircle,
      title: "Verified Payments",
      description:
        "Every payment is verified through your bank's authentication system",
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Most payments are processed instantly or within minutes",
    },
  ];

  const currencyInfo = {
    symbol: "₸",
    code: "KZT",
    name: "Kazakhstan Tenge",
    exchangeRate: "1 Token = ₸10",
    minPurchase: "₸100",
    maxPurchase: "₸50,000",
  };

  return (
    <div className="space-y-6">
      {/* Currency Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Payment Information for Kazakhstan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Currency Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">
                    {currencyInfo.name} ({currencyInfo.code})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="font-medium">
                    {currencyInfo.exchangeRate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Purchase:</span>
                  <span className="font-medium">
                    {currencyInfo.minPurchase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Purchase:</span>
                  <span className="font-medium">
                    {currencyInfo.maxPurchase}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Important Notes</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• All prices are shown in Kazakhstan Tenge (₸)</p>
                <p>
                  • Payments are processed through licensed financial
                  institutions
                </p>
                <p>• Refunds are processed within 3-5 business days</p>
                <p>
                  • Customer support available in Kazakh, Russian, and English
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Available Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;

              return (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg mt-1">
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{method.name}</h4>
                        {method.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {method.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Processing:</span>
                          <div className="font-medium">
                            {method.processingTime}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Fees:</span>
                          <div className="font-medium">{method.fees}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {method.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Trust
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    How long do payments take?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Most payments are processed instantly. Bank transfers may
                    take 1-5 minutes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Are there any hidden fees?
                  </h4>
                  <p className="text-sm text-gray-600">
                    No hidden fees. All processing fees are clearly displayed
                    before payment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                  <p className="text-sm text-gray-600">
                    Unused tokens can be refunded within 30 days of purchase.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Contact Support</h4>
                  <p className="text-sm text-gray-600">
                    Email: support@toyrental.kz
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: +7 (727) 123-4567
                  </p>
                  <p className="text-sm text-gray-600">
                    Hours: 9:00 - 18:00 (GMT+6)
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Languages</h4>
                  <p className="text-sm text-gray-600">
                    Kazakh, Russian, English
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-4">
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  All payments are processed in compliance with Kazakhstan
                  financial regulations.
                </p>
                <p>
                  Licensed by the National Bank of Kazakhstan for electronic
                  payment processing.
                </p>
                <p>
                  Personal data is protected according to Kazakhstan data
                  protection laws.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
