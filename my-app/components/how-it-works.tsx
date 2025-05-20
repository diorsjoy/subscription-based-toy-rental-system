import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Repeat, Truck } from "lucide-react"
import Image from "next/image";

export function HowItWorks() {
  const steps = [
    {
      title: "CHOOSE TOYS TO BORROW",
      description: "Pick from over 1,000 of the latest toys we have in stock.",
      icon: "/icons/choose.svg"
    },
    {
      title: "TOTAL FLEXIBILITY",
      description: "Keep toys for as long as they are loved at home.",
      icon: "/icons/flexibility.svg"
    },
    {
      title: "SWAP AND REPEAT",
      description: "Return any unwanted toy and swap it for something else.",
      icon: "/icons/swap.svg"
    },
    {
      title: "OR KEEP THEM FOREVER",
      description: "Don't worry if your child has fallen in love with a toy, you can buy it from us.",
      icon: "/icons/keep.svg"
    }
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          How does it work?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative group"
            >
              <div className="animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-primary">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0">
                  <div className="absolute right-0 -top-1 w-2 h-2 bg-primary rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
