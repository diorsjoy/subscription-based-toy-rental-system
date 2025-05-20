import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Baby,
  Gift,
  ShieldCheck,
  Calendar,
  ToyBrick,
  CircleDollarSign,
  PackageCheck,
  RefreshCw,
  HeartHandshake,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const faqItems = [
  {
    icon: <ToyBrick className="w-5 h-5" />,
    question: "How does the toy rental subscription work?",
    answer:
      "Our toy rental subscription allows you to choose toys from our catalog...",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    question: "Are the toys clean and safe?",
    answer: "Yes, we have a rigorous cleaning and sanitization process...",
  },
  {
    icon: <HeartHandshake className="w-5 h-5" />,
    question: "What if a toy gets damaged?",
    answer: "We understand that accidents happen...",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    question: "How long can we keep the toys?",
    answer: "You can keep the toys for as long as you like...",
  },
  {
    icon: <CircleDollarSign className="w-5 h-5" />,
    question: "Can I purchase a toy?",
    answer: "Yes! If your child loves a toy, purchase it at a discount...",
  },
  {
    icon: <Baby className="w-5 h-5" />,
    question: "What age range do your toys cover?",
    answer: "We offer toys suitable for children from 0 to 12 years...",
  },
  {
    icon: <PackageCheck className="w-5 h-5" />,
    question: "How do I return the toys?",
    answer: "Returning toys is easy! Schedule a pickup...",
  },
  {
    icon: <Search className="w-5 h-5" />,
    question: "Missing pieces?",
    answer: "Contact us immediately for replacement...",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    question: "Can I pause or cancel?",
    answer: "Pause for up to 3 months or cancel anytime...",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    question: "Gift subscriptions?",
    answer: "Perfect gift! Purchase any duration...",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Everything you need to know about Oiyn Shak
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Input
                placeholder="Search questions..."
                className="pl-12 py-6 rounded-xl"
              />
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">
                Hospital-grade sanitization process
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <RefreshCw className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Plans</h3>
              <p className="text-gray-600">Pause or cancel anytime</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Gift className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gift Options</h3>
              <p className="text-gray-600">
                Perfect presents for growing minds
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AccordionTrigger className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-left">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-primary/5 rounded-xl p-8 border border-primary/20">
            <h2 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h2>
            <p className="mb-6">Our team is here to help!</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
