"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 4990,
    tokens: 50,
    description: "Perfect for families just getting started",
    popular: false,
    features: [
      "50 tokens per month",
      "Access to 100+ toys",
      "1 toy swap per week",
      "Free standard delivery",
      "Basic damage protection",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: 9990,
    tokens: 100,
    description: "Our most popular plan for active families",
    popular: true,
    features: [
      "100 tokens per month",
      "Access to 300+ toys",
      "2 toy swaps per week",
      "Free express delivery",
      "Extended damage protection",
      "Priority customer support",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 19990,
    tokens: 200,
    description: "Unlimited fun for toy enthusiasts",
    popular: false,
    features: [
      "200 tokens per month",
      "Access to all toys including new releases",
      "Unlimited toy swaps",
      "Free same-day delivery",
      "Full damage protection",
      "24/7 premium customer support",
      "Exclusive access to special events",
    ],
  },
];

export function PricingPlans() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else {
      router.push("/subscription");
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your family's playtime needs. All plans
            include access to our premium toy collection with flexible rental
            periods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-black px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>

                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {plan.price.toLocaleString()}
                    <span className="text-lg font-normal text-gray-500">
                      {" "}
                      KZT
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">/month</p>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      {plan.tokens} tokens per month
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    ≈ {Math.floor(plan.tokens / 30)} token per day
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isAuthenticated ? "Select Plan" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you?
          </p>
          <Button
            variant="outline"
            onClick={() =>
              router.push(isAuthenticated ? "/subscription" : "/auth")
            }
          >
            {isAuthenticated ? "View All Plans" : "Start Free Trial"}
          </Button>
        </div>
      </div>
    </section>
  );
}
