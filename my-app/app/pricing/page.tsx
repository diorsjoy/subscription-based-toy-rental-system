import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PricingPlans } from "@/components/pricing-plans";
import { FAQ } from "@/components/faq";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <PricingPlans />
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
