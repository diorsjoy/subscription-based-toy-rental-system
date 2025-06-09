import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <SubscriptionPlans />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
