"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Puzzle,
  Users,
  Gift,
  Car,
  Zap,
  Brush,
  Grid,
  Sparkles,
  ArrowRight,
  Gamepad2,
  Building,
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Category definitions with icons and descriptions
const toyCategories = [
  {
    id: "Educational",
    name: "Educational",
    description: "Learning toys that inspire curiosity and knowledge",
    icon: BookOpen,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    count: 0, // Will be populated from API
  },
  {
    id: "Building Sets",
    name: "Building Sets",
    description: "Construction toys for creative building and engineering",
    icon: Building,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    count: 0,
  },
  {
    id: "Action Figures",
    name: "Action Figures",
    description: "Heroic figures for imaginative adventures",
    icon: Users,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    count: 0,
  },
  {
    id: "Dolls & Accessories",
    name: "Dolls & Accessories",
    description: "Dolls and accessories for nurturing play",
    icon: Gift,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    count: 0,
  },
  {
    id: "Board Games",
    name: "Board Games",
    description: "Strategic games for family fun and learning",
    icon: Puzzle,
    color: "from-indigo-400 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
    count: 0,
  },
  {
    id: "Outdoor Toys",
    name: "Outdoor Toys",
    description: "Active play toys for outdoor adventures",
    icon: Car,
    color: "from-cyan-400 to-teal-500",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    count: 0,
  },
  {
    id: "Electronic Toys",
    name: "Electronic Toys",
    description: "Tech toys with interactive features",
    icon: Zap,
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    count: 0,
  },
  {
    id: "Arts & Crafts",
    name: "Arts & Crafts",
    description: "Creative supplies for artistic expression",
    icon: Palette,
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    count: 0,
  },
];

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

export function FeaturedToys() {
  const [categories, setCategories] = useState(toyCategories);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getHeaders = useApiHeaders();

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      setLoading(true);

      // Fetch all toys to count categories
      const response = await fetch(
        `${API_BASE_URL}/toys?pageSize=100&sort=id`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch toys: ${response.status}`);
      }

      const data = await response.json();
      const toys = data.toys || [];

      // Count toys per category
      const updatedCategories = categories.map((category) => {
        const count = toys.filter(
          (toy: any) => toy.categories && toy.categories.includes(category.id)
        ).length;

        return {
          ...category,
          count: count,
        };
      });

      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to load category counts:", error);
      // Keep original categories with 0 counts on error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to browse page with category filter
    router.push(`/browse?category=${encodeURIComponent(categoryId)}`);
  };

  const handleViewAllCategories = () => {
    router.push("/browse");
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Grid className="w-3 h-3 mr-1" />
              Browse Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Explore by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Grid className="w-3 h-3 mr-1" />
              Browse Categories
            </Badge>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect toys for your child by browsing our carefully
            organized categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border-2 hover:${category.borderColor} ${category.bgColor}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardHeader className="text-center pb-4">
                    {/* Icon with gradient background */}
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle
                      className={`text-lg font-bold ${category.textColor} group-hover:text-opacity-80 transition-colors mb-2`}
                    >
                      {category.name}
                    </CardTitle>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {category.description}
                    </p>

                    {/* Toy count */}
                    <div className="flex items-center justify-center">
                      <Badge
                        variant="outline"
                        className={`${category.borderColor} ${category.textColor} text-xs`}
                      >
                        {category.count} {category.count === 1 ? "toy" : "toys"}
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div
                      className={`bg-gradient-to-r ${category.color} text-white px-4 py-2 rounded-full flex items-center font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300`}
                    >
                      Browse Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Join thousands of happy families who have discovered the joy of
              our toy rental service.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Browsing Toys
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
