"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, RefreshCw, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function HowItWorks() {
  const steps = [
    {
      title: "CHOOSE TOYS TO BORROW",
      description: "Pick from over 1,000 of the latest toys we have in stock.",
      icon: Search,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "TOTAL FLEXIBILITY",
      description: "Keep toys for as long as they are loved at home.",
      icon: Clock,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "SWAP AND REPEAT",
      description: "Return any unwanted toy and swap it for something else.",
      icon: RefreshCw,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "OR KEEP THEM FOREVER",
      description:
        "Don't worry if your child has fallen in love with a toy, you can buy it from us.",
      icon: Heart,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
  ];

  // Floating toy images for decoration - using existing toy image or fallback to icons
  const floatingToys = [
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 1",
      position: "left-0 top-20",
      size: "w-16 h-16",
      animation: { y: [0, -20, 0], duration: 4, delay: 0 },
    },
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 2",
      position: "left-8 top-1/2",
      size: "w-20 h-20",
      animation: { y: [0, -15, 0], duration: 5, delay: 1 },
    },
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 3",
      position: "right-0 top-32",
      size: "w-18 h-18",
      animation: { y: [0, -25, 0], duration: 6, delay: 2 },
    },
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 4",
      position: "right-12 top-2/3",
      size: "w-14 h-14",
      animation: { y: [0, -18, 0], duration: 4.5, delay: 3 },
    },
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 5",
      position: "left-4 bottom-32",
      size: "w-16 h-16",
      animation: { y: [0, -22, 0], duration: 5.5, delay: 0.5 },
    },
    {
      src: "/toys-images/floating-toy-1.png", // Use existing image
      alt: "Floating toy 6",
      position: "right-8 bottom-20",
      size: "w-20 h-20",
      animation: { y: [0, -16, 0], duration: 4.2, delay: 2.5 },
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating toy images */}
        {floatingToys.map((toy, index) => (
          <motion.div
            key={index}
            className={`absolute ${toy.position} ${toy.size} opacity-20 hover:opacity-40 transition-opacity duration-300`}
            animate={{
              y: toy.animation.y,
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              y: {
                duration: toy.animation.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: toy.animation.delay,
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: toy.animation.delay,
              },
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={toy.src}
                alt={toy.alt}
                width={80}
                height={80}
                className="object-contain filter drop-shadow-lg rounded-lg"
                style={{
                  transform: `scale(${0.7 + (index % 3) * 0.15})`,
                  filter: `hue-rotate(${index * 60}deg) brightness(0.9)`,
                }}
                onError={(e) => {
                  // Hide the entire container if image fails to load
                  const container = e.currentTarget.closest(".absolute");
                  if (container) {
                    (container as HTMLElement).style.display = "none";
                  }
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Additional floating geometric shapes */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-1/4 w-8 h-8 bg-blue-200/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-200/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-1/3 w-10 h-10 bg-pink-200/30 rounded-full blur-sm"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple Process
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            How does it work?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Getting started with our toy rental service is simple and
            straightforward. Follow these easy steps to bring joy to your child.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                className="relative group h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="h-full">
                  <Card className="h-full bg-white border-2 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 group">
                    <CardHeader className="text-center pb-4">
                      {/* Step number */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>

                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full ${step.color} border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-sm font-bold text-gray-800 leading-tight min-h-[2.5rem] flex items-center justify-center">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-blue-400/50 to-indigo-400/30 -translate-y-1/2 z-0">
                    <motion.div
                      className="absolute right-0 -top-1 w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
