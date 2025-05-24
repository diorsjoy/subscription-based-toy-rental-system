"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Calculator, TrendingUp } from "lucide-react";

interface CurrencyConverterProps {
  onConvert?: (kztAmount: number, tokenAmount: number) => void;
}

export function CurrencyConverter({ onConvert }: CurrencyConverterProps) {
  const [kztAmount, setKztAmount] = useState<number>(1000);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [conversionRate] = useState<number>(10); // 1 token = 10 KZT
  const [isConverting, setIsConverting] = useState<
    "kzt-to-token" | "token-to-kzt"
  >("kzt-to-token");

  // Exchange rate information (mock data)
  const exchangeInfo = {
    rate: conversionRate,
    lastUpdated: new Date().toLocaleDateString(),
    trend: "+2.3%", // Mock trend
  };

  useEffect(() => {
    if (isConverting === "kzt-to-token") {
      setTokenAmount(Math.floor(kztAmount / conversionRate));
    } else {
      setKztAmount(tokenAmount * conversionRate);
    }
  }, [kztAmount, tokenAmount, conversionRate, isConverting]);

  const handleKztChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setKztAmount(numValue);
    setIsConverting("kzt-to-token");
  };

  const handleTokenChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setTokenAmount(numValue);
    setIsConverting("token-to-kzt");
  };

  const handleSwapCurrencies = () => {
    setIsConverting(
      isConverting === "kzt-to-token" ? "token-to-kzt" : "kzt-to-token"
    );
    // The useEffect will handle the conversion
  };

  const handleConvert = () => {
    onConvert?.(kztAmount, tokenAmount);
  };

  const getTokenPackages = () => [
    { tokens: 100, kzt: 1000, bonus: 0, popular: false },
    { tokens: 250, kzt: 2250, bonus: 25, popular: false },
    { tokens: 500, kzt: 4500, bonus: 100, popular: true },
    { tokens: 1000, kzt: 8500, bonus: 350, popular: false },
  ];

  const packages = getTokenPackages();

  return (
    <div className="space-y-6">
      {/* Main Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="kzt-amount">Kazakhstan Tenge (₸)</Label>
              <Input
                id="kzt-amount"
                type="number"
                value={kztAmount}
                onChange={(e) => handleKztChange(e.target.value)}
                placeholder="Enter KZT amount"
                className="text-lg"
              />
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token-amount">Tokens</Label>
              <Input
                id="token-amount"
                type="number"
                value={tokenAmount}
                onChange={(e) => handleTokenChange(e.target.value)}
                placeholder="Enter token amount"
                className="text-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Exchange Rate: 1 Token = ₸{conversionRate}</span>
              </div>
              <p className="text-xs mt-1">
                Last updated: {exchangeInfo.lastUpdated} • {exchangeInfo.trend}
              </p>
            </div>
            {onConvert && (
              <Button onClick={handleConvert} size="sm">
                Convert
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Token Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Token Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.tokens}
                className={`p-4 border rounded-lg relative ${
                  pkg.popular
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
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
                    <div className="text-xs text-green-600 font-medium mt-1">
                      +{pkg.bonus} bonus tokens
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="text-lg font-semibold">₸{pkg.kzt}</div>
                    <div className="text-xs text-gray-500">
                      ₸{(pkg.kzt / (pkg.tokens + pkg.bonus)).toFixed(1)} per
                      token
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-yellow-700">
              Larger packages offer better value with bonus tokens! The
              500-token package gives you the best value for regular users.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
