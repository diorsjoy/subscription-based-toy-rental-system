"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const subscriptionPlans = [
  {
    name: "Basic",
    price: 4990,
    tokens: 50,
    features: [
      "50 tokens per month",
      "Access to 100+ toys",
      "1 toy swap per week",
      "Free standard delivery",
    ],
  },
  {
    name: "Premium",
    price: 7990,
    tokens: 100,
    features: [
      "100 tokens per month",
      "Access to 300+ toys",
      "2 toy swaps per week",
      "Free express delivery",
      "Priority customer support",
    ],
  },
  {
    name: "Ultimate",
    price: 11990,
    tokens: 200,
    features: [
      "200 tokens per month",
      "Access to all toys including new releases",
      "Unlimited toy swaps",
      "Free same-day delivery",
      "24/7 premium customer support",
      "Exclusive access to special events",
    ],
  },
];

export default function SubscribePage() {
  const { toast } = useToast();

  const handleSubscribe = (planName: string) => {
    // In a real application, this would initiate the subscription process
    toast({
      title: "Subscription Initiated",
      description: `You've selected the ${planName} plan. Redirecting to payment...`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-16">
        <h1 className="text-4xl font-bold mb-8">
          Choose Your Subscription Plan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold mb-4">
                  {plan.price} KZT
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <p className="text-lg font-semibold mb-4">
                  {plan.tokens} tokens per month
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name)}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
