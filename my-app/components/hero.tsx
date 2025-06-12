"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GradientOverlay } from "@/components/gradient-overlay";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Star,
  Zap,
  Gift,
  Rocket,
  Crown,
  Gamepad2,
  Camera,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// API Types (matching your browse page)
interface Toy {
  id: number;
  title: string;
  desc: string;
  value: number;
  images: string[];
  skills: string[];
  categories: string[];
  recommendedAge: string;
  manufacturer: string;
  isAvailable: boolean;
}

interface ApiResponse {
  toys: Toy[];
  metadata: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
  };
  status: string;
  errorMsg?: string;
}

// API integration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL1 || "http://localhost:3030";

const useApiHeaders = () => {
  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  return (): Record<string, string> => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };
};

export function Hero() {
  const [showcaseToys, setShowcaseToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentToyIndex, setCurrentToyIndex] = useState(0);
  const router = useRouter();
  const getHeaders = useApiHeaders();

  // Floating toy icons data
  const floatingToys = [
    { icon: Rocket, color: "text-blue-400", delay: 0 },
    { icon: Heart, color: "text-pink-400", delay: 0.5 },
    { icon: Star, color: "text-yellow-400", delay: 1 },
    { icon: Zap, color: "text-purple-400", delay: 1.5 },
    { icon: Gift, color: "text-green-400", delay: 2 },
    { icon: Crown, color: "text-orange-400", delay: 2.5 },
    { icon: Gamepad2, color: "text-indigo-400", delay: 3 },
    { icon: Sparkles, color: "text-cyan-400", delay: 3.5 },
  ];

  useEffect(() => {
    loadShowcaseToys();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (showcaseToys.length > 0) {
      const interval = setInterval(() => {
        setCurrentToyIndex((prev) => (prev + 1) % showcaseToys.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showcaseToys.length]);

  const loadShowcaseToys = async () => {
    try {
      setLoading(true);

      // Fetch toys for showcase
      const response = await fetch(`${API_BASE_URL}/toys?pageSize=6&sort=id`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch toys: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // Get first 4-5 toys for carousel
      const toys = (data.toys || []).slice(0, 5);

      // Fetch detailed information including images for each toy
      const toysWithDetails = await Promise.all(
        toys.map(async (toy) => {
          try {
            const detailResponse = await fetch(
              `${API_BASE_URL}/toys/${toy.id}`,
              {
                method: "GET",
                headers: getHeaders(),
              }
            );

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              return detailData.toy;
            }
            return toy;
          } catch (error) {
            console.error(`Failed to get details for toy ${toy.id}:`, error);
            return toy;
          }
        })
      );

      setShowcaseToys(toysWithDetails);
    } catch (error) {
      console.error("Failed to load showcase toys:", error);
      setShowcaseToys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseToys = () => {
    router.push("/browse");
  };

  const handleToyClick = (toyId: number) => {
    router.push(`/toy-details?id=${toyId}`);
  };

  const nextToy = () => {
    setCurrentToyIndex((prev) => (prev + 1) % showcaseToys.length);
  };

  const prevToy = () => {
    setCurrentToyIndex(
      (prev) => (prev - 1 + showcaseToys.length) % showcaseToys.length
    );
  };

  const currentToy = showcaseToys[currentToyIndex];

  return (
    <div className="relative min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Side - Hero Content */}
      <div className="relative overflow-hidden flex items-center justify-center p-8 lg:p-16">
        {/* Floating toy icons */}
        <div className="absolute inset-0">
          {floatingToys.map((toy, index) => {
            const IconComponent = toy.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-20, -100, -180],
                  x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: toy.delay,
                  ease: "easeOut",
                }}
                className={`absolute ${toy.color}`}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 60 + 20}%`,
                }}
              >
                <IconComponent className="w-6 h-6" />
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 text-center lg:text-left max-w-xl">
          <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Toy Rental Service
          </span>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ENDLESS
            <br />
            PLAY
          </h1>

          <p className="text-lg lg:text-xl mb-8 text-gray-600 leading-relaxed">
            Discover a world of educational and entertaining toys with our
            <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              premium subscription-based rental service
            </span>
          </p>

          <Button
            onClick={handleBrowseToys}
            className="
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-700 hover:to-purple-700
                text-white
                font-bold
                py-4
                px-8
                text-lg
                rounded-xl
                relative
                overflow-hidden
                group
                transform hover:scale-105
                transition-all duration-300
                shadow-xl hover:shadow-2xl
              "
          >
            <span className="relative z-10 flex items-center">
              <Rocket className="w-5 h-5 mr-2" />
              BROWSE TOYS
            </span>
          </Button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex mt-8 justify-center lg:justify-start space-x-3"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  width: index === 0 ? "3rem" : "1rem",
                  backgroundColor: index === 0 ? "#3B82F6" : "#93C5FD",
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="h-1 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Toy Carousel with Frame Design */}
      <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm p-8 lg:p-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center lg:text-left mb-8"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Toys
          </h2>
          <p className="text-gray-600 text-lg">
            Discover amazing toys from our premium collection
          </p>
        </motion.div>

        {/* Toy Carousel with Frame Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full aspect-[4/3] mb-8"
        >
          {loading ? (
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Loading toys...</div>
            </div>
          ) : currentToy ? (
            <>
              {/* Decorative border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-sm opacity-30" />
              <div
                className="absolute inset-2 bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => handleToyClick(currentToy.id)}
              >
                {/* Main toy image */}
                <div className="relative w-full h-3/5">
                  {currentToy.images && currentToy.images[0] ? (
                    <img
                      src={currentToy.images[0]}
                      alt={currentToy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".image-fallback"
                          );
                        if (fallback) {
                          (fallback as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className={`image-fallback w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ${
                      currentToy.images && currentToy.images[0]
                        ? "hidden"
                        : "flex"
                    }`}
                  >
                    <Camera className="w-16 h-16 text-blue-400" />
                  </div>

                  {/* Availability badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${
                        currentToy.isAvailable
                          ? "bg-green-500  text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {currentToy.isAvailable ? "Available" : "Rented"}
                    </Badge>
                  </div>

                  {/* Premium badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>

                {/* Toy information */}
                <div className="p-4 h-2/5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {currentToy.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {currentToy.desc}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {currentToy.recommendedAge}
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {currentToy.manufacturer}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {currentToy.value.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">KZT</span>
                      </div>

                      {currentToy.skills.length > 0 && (
                        <div className="flex gap-1">
                          {currentToy.skills.slice(0, 1).map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {currentToy.skills.length > 1 && (
                            <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              +{currentToy.skills.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              {showcaseToys.length > 1 && (
                <>
                  <button
                    onClick={prevToy}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextToy}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-purple-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-purple-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
            </>
          ) : (
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-gray-400">No toys available</div>
            </div>
          )}
        </motion.div>

        {/* Carousel indicators */}
        {showcaseToys.length > 1 && (
          <div className="flex justify-center space-x-2 mb-8">
            {showcaseToys.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentToyIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentToyIndex
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            {
              icon: Crown,
              text: "Premium Quality",
              color: "from-yellow-400 to-orange-400",
            },
            {
              icon: Zap,
              text: "Quick Delivery",
              color: "from-blue-400 to-cyan-400",
            },
            {
              icon: Heart,
              text: "Child Safe",
              color: "from-pink-400 to-red-400",
            },
            {
              icon: Sparkles,
              text: "Educational",
              color: "from-purple-400 to-indigo-400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:border-blue-200 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2 mx-auto`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">
                {feature.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 text-center lg:text-left"
        >
          <div className="flex justify-center lg:justify-start space-x-8 text-sm text-gray-600">
            <div>
              <span className="block text-2xl font-bold text-blue-600">
                1000+
              </span>
              <span>Toys Available</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-purple-600">
                50K+
              </span>
              <span>Happy Kids</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-green-600">
                99%
              </span>
              <span>Satisfaction</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
