import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { FeaturedToys } from "@/components/featured-toys";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { PricingPlans } from "@/components/pricing-plans";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <FeaturedToys />
        <HowItWorks />
        <Testimonials />
        <PricingPlans />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
