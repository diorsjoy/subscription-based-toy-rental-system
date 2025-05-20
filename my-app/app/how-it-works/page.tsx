import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Package,
  Repeat,
  Truck,
  Search,
  Calendar,
} from "lucide-react";

const steps = [
  {
    title: "Choose Your Plan",
    description:
      "Select a subscription plan that fits your family's needs and budget.",
    icon: CheckCircle,
  },
  {
    title: "Browse & Select",
    description:
      "Explore our vast catalog of toys and add your favorites to your queue.",
    icon: Search,
  },
  {
    title: "Schedule Delivery",
    description: "Choose a convenient delivery date for your selected toys.",
    icon: Calendar,
  },
  {
    title: "Receive & Play",
    description:
      "Your toys arrive clean and ready for play. Let the fun begin!",
    icon: Truck,
  },
  {
    title: "Return & Repeat",
    description:
      "When you're done, schedule a pickup and select new toys to try.",
    icon: Repeat,
  },
  {
    title: "Sanitize & Share",
    description:
      "We thoroughly clean and sanitize all returned toys before sending them to the next family.",
    icon: Package,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">
              How Oiyn Shak Works
            </h1>
            <p className="text-center text-muted-foreground mb-12">
              Discover how easy it is to bring endless play to your home
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <step.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
