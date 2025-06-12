"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Sparkles,
  Shield,
  Clock,
  RefreshCw,
  Heart,
  Truck,
  CheckCircle,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const faqItems = [
  {
    question: "How does the toy rental subscription work?",
    answer:
      "Our toy rental subscription allows you to choose toys from our catalog, have them delivered to your home, and return them when you're ready for new ones. You pay a monthly fee based on your chosen plan, which determines how many tokens you receive and how often you can swap toys.",
    icon: RefreshCw,
    category: "Getting Started",
  },
  {
    question: "Are the toys clean and safe?",
    answer:
      "We have a rigorous cleaning and sanitization process for all toys between rentals. Each toy undergoes professional cleaning with child-safe products and UV sanitization. We also regularly inspect toys for any damage or wear to ensure they meet our high safety standards.",
    icon: Shield,
    category: "Safety & Quality",
  },
  {
    question: "What if a toy gets damaged while we have it?",
    answer:
      "We understand that accidents happen, especially with children at play. Our subscriptions include basic damage protection for normal wear and tear. For more extensive damage, we assess each situation individually and may charge a small fee depending on the extent of the damage.",
    icon: CheckCircle,
    category: "Policy",
  },
  {
    question: "How long can we keep the toys?",
    answer:
      "You can keep the toys for as long as you like within your subscription period! There are no strict return deadlines. However, to make the most of your subscription and try more toys, we recommend swapping toys regularly based on your plan's allowance.",
    icon: Clock,
    category: "Usage",
  },
  {
    question: "Can I purchase a toy if my child really loves it?",
    answer:
      "Absolutely! If your child falls in love with a particular toy, you have the option to purchase it at a discounted rate (usually 20-30% off retail price). Just let us know through the app or website, and we'll arrange the purchase and remove the toy from your rental queue.",
    icon: Heart,
    category: "Purchase Options",
  },
  {
    question: "How does delivery and pickup work?",
    answer:
      "We offer free delivery and pickup within Almaty, Nur-Sultan, and Shymkent. Delivery typically takes 1-2 business days. You can schedule pickups through our app when you're ready to return toys. For other cities, we provide convenient shipping options.",
    icon: Truck,
    category: "Delivery",
  },
  {
    question: "What age ranges do you cover?",
    answer:
      "Our toy collection covers children from 6 months to 12 years old. Each toy in our catalog clearly indicates the recommended age range, developmental benefits, and safety considerations. You can filter toys by age in our browse section.",
    icon: Star,
    category: "Age & Development",
  },
];

// Group FAQs by category
const categories = Array.from(new Set(faqItems.map((item) => item.category)));

export function FAQ() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              Help Center
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about Oiyn Shak toy rental service.
            Can't find what you're looking for? Contact our support team.
          </motion.p>
        </div>

        {/* Category indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category, index) => (
            <Badge
              key={category}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {item.question}
                        </div>
                        <Badge
                          variant="outline"
                          className="mt-1 border-blue-200 text-blue-600 text-xs"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="ml-14 space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>

                      {/* Additional context based on category */}
                      {item.category === "Safety & Quality" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            All toys meet international safety standards (CE,
                            ASTM)
                          </div>
                        </div>
                      )}

                      {item.category === "Purchase Options" && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-purple-800 text-sm font-medium">
                            <Heart className="w-4 h-4" />
                            Average discount: 20-30% off retail price
                          </div>
                        </div>
                      )}

                      {item.category === "Delivery" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium">
                            <Truck className="w-4 h-4" />
                            Free delivery in major cities • 1-2 day delivery
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
