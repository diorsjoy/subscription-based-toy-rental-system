import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Truck,
  RefreshCw,
  Box,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";
import React from "react";

const shippingInfo = [
  {
    icon: <Truck className="w-5 h-5" />,
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-5 business days. Express shipping available for 1-2 business day delivery.",
  },
  {
    icon: <Box className="w-5 h-5" />,
    question: "Do you ship to all areas in Kazakhstan?",
    answer:
      "Yes, we ship nationwide including major cities and rural areas. Remote locations may require additional time.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    question: "How much does shipping cost?",
    answer: "Fees calculated by location/weight.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    question: "Can I track my shipment?",
    answer: "Yes! Track your package with the tracking number sent via email.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    question: "Missed delivery?",
    answer: "Two delivery attempts + pickup notice for rescheduling.",
  },
];

const returnsInfo = [
  {
    icon: <RefreshCw className="w-5 h-5" />,
    question: "Subscription return policy?",
    answer: "Return rented toys anytime with scheduled pickup.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    question: "Damaged during play?",
    answer: "Basic damage protection included. Fees only for extensive damage.",
  },
  {
    icon: <Box className="w-5 h-5" />,
    question: "Return purchased toys?",
    answer: "30-day returns for unworn items. Customer pays return shipping.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    question: "Schedule return pickup?",
    answer: "Select toys in 'My Rentals' and choose pickup date.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    question: "Return condition?",
    answer: "Clean toys with all pieces. Normal wear accepted.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping & Returns
            </h1>
            <p className="text-lg text-gray-600">
              Fast, reliable service with hassle-free returns
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Truck className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nationwide Shipping
              </h3>
              <p className="text-gray-600">
                Free delivery for all subscriptions
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <RefreshCw className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Schedule pickups from your home</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Damage Protection</h3>
              <p className="text-gray-600">Included in every subscription</p>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="grid md:grid-cols-2 gap-12">
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Truck className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-semibold">Shipping Information</h2>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {shippingInfo.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`shipping-${index}`}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="hover:bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-left">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <RefreshCw className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-semibold">Returns & Exchanges</h2>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {returnsInfo.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`returns-${index}`}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="hover:bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-left">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
