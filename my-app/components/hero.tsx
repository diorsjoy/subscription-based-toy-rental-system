"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GradientOverlay } from "@/components/gradient-overlay";

export function Hero() {
  const [glitchActive, setGlitchActive] = useState(false);

  // Random glitch effect
  // useEffect(() => {
  //   const glitchInterval = setInterval(() => {
  //     setGlitchActive(true);
  //     setTimeout(() => setGlitchActive(false), 200);
  //   }, 5000);

  //   return () => clearInterval(glitchInterval);
  // }, []);

  return (
    <div className="relative min-h-[70vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left Side - Hero Image */}
      <div className="relative overflow-hidden">
        <Image
          src="/toys-images/toy-boxing.png"
          alt="Featured Toy"
          className="w-full h-full object-cover"
          width={800}
          height={800}
        />
        <GradientOverlay />

        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <h1
            className={`
            text-6xl 
            font-black 
            mb-6 
            relative
            ${glitchActive ? "skew-x-1" : ""}
            transition-transform duration-100
          `}
          >
            <div className="relative inline-block">
              <span className="relative z-10">ENDLESS</span>
              {glitchActive && (
                <span className="absolute top-0.5 left-0.5 text-blue-500 opacity-70 z-0">
                  ENDLESS
                </span>
              )}
            </div>
            <br />
            <div className="relative inline-block">
              <span className="relative z-10">PLAY</span>
              {glitchActive && (
                <span className="absolute top-0.5 left-0.5 text-red-500 opacity-70 z-0">
                  PLAY
                </span>
              )}
            </div>
          </h1>

          <p className="text-lg mb-8 ">
            Discover a world of toys with our
            <br />
            subscription-based rental service
          </p>

          {/* Blocky button */}
          <Button
            className="
              bg-blue-600
              text-white
              font-bold
              py-3
              px-8
              w-48
              relative
              overflow-hidden
              group
            "
            onMouseEnter={() => setGlitchActive(true)}
            onMouseLeave={() => setGlitchActive(false)}
          >
            {/* Button corners */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-blue-300"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-blue-300"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-300"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-300"></div>

            <span className="relative z-10">BROWSE TOYS</span>
            <div className="absolute inset-0 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full opacity-20"></div>
          </Button>

          <div className="flex mt-8 space-x-2">
            <div className="w-12 h-1 bg-blue-500"></div>
            <div className="w-12 h-1 bg-blue-900"></div>
            <div className="w-12 h-1 bg-blue-900"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Unboxing Experience */}
      <div className="relative bg-blue-900 bg-opacity-20 p-16 flex flex-col justify-center">
        <h2
          className={`
          text-4xl 
          font-bold 
          mb-6
          ${glitchActive ? "-translate-x-0.5" : ""}
          transition-transform duration-100
        `}
        >
          One Subscription, Endless Joy
        </h2>

        <p className=" mb-8">
          Keep your children engaged and learning without the clutter. Our
          subscription service brings new toys to your doorstep.
        </p>

        <div
          className="
          w-full 
          aspect-video 
          mb-8 
          relative 
          overflow-hidden
          border-2 border-blue-800
        "
        >
          <Image
            width={800}
            height={800}
            src="/toys-images/toy-boxing.png"
            alt="Toy unboxing"
            className="w-full h-full object-cover"
          />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
        </div>

        <h3 className="text-2xl font-bold mb-4">How It Works</h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "choose", name: "Choose Plan" },
            { id: "receive", name: "Receive Toys" },
            { id: "swap", name: "Swap & Repeat" },
          ].map((item) => (
            <div
              key={item.id}
              className="
                bg-blue-800 
                bg-opacity-30 
                p-4 
                border border-blue-700
                flex flex-col 
                items-center
                transform hover:scale-105 hover:border-blue-500
                transition-all duration-300
              "
            >
              <div className="w-24 h-24 mb-4 bg-blue-900 p-2">
                <Image
                  width={200}
                  height={200}
                  src="/placeholder.svg?height=200&width=200"
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-blue-200">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
