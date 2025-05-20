import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 4990,
    tokens: 50,
    description: "Perfect for families just getting started",
    features: [
      "50 tokens per month",
      "Access to 100+ toys",
      "1 toy swap per week",
      "Free standard delivery",
      "Basic damage protection",
    ],
  },
  {
    name: "Family",
    price: 9990,
    tokens: 100,
    description: "Our most popular plan for active families",
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
    name: "Ultimate",
    price: 19990,
    tokens: 200,
    description: "Unlimited fun for toy enthusiasts",
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
  return (
    <section className="py-16 px-6  dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Choose Your Plan
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Select the perfect plan for your family's playtime needs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold mb-2">
                  {plan.price.toLocaleString()} KZT
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
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
