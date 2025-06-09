// app/toy-details/page.tsx - Real API Integration
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, Suspense } from "react";
import { useCart } from "@/components/cart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Star,
  Share2,
  ShoppingCart,
  Zap,
  Package,
  Users,
  Clock,
  Award,
  Shield,
  Truck,
  RefreshCw,
  Camera,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Building,
  Calendar,
  Target,
  Lightbulb,
} from "lucide-react";
import { ToyImage } from "@/components/CustomImage";

// Remove the regular img import since we're using custom component

// API Types matching your backend
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

// Backend API integration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL1 || "http://localhost:3030";

const useApiHeaders = () => {
  const { user } = useAuth();

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

const createToyAPI = (getHeaders: () => Record<string, string>) => ({
  getToy: async (toyId: number): Promise<{ toy: Toy }> => {
    const response = await fetch(`${API_BASE_URL}/toys/${toyId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Toy not found");
      }
      throw new Error(`Failed to fetch toy: ${response.status}`);
    }
    return response.json();
  },
});

// Main component wrapped in Suspense boundary
function ToyDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toyId = searchParams.get("id");
  const { addItem } = useCart();
  const { toast } = useToast();
  const getHeaders = useApiHeaders();
  const toyAPI = createToyAPI(getHeaders);

  // State
  const [toy, setToy] = useState<Toy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Load toy data
  useEffect(() => {
    if (toyId) {
      loadToy(parseInt(toyId));
    } else {
      setError("No toy ID provided");
      setLoading(false);
    }
  }, [toyId]);

  const loadToy = async (id: number): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await toyAPI.getToy(id);
      setToy(response.toy);

      // Check if toy is in wishlist (from localStorage)
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsWishlisted(wishlist.includes(id));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error Loading Toy",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!toy) return;

    const cartItem = {
      id: toy.id,
      title: toy.title,
      description: toy.desc,
      ageRange: toy.recommendedAge,
      category: toy.categories[0] || "General",
      rating: 4.5, // Default rating
      tokens: toy.value,
      image: toy.images[0] || "/placeholder.svg",
      quantity,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    toast({
      title: `Added ${quantity}x to Cart! 🛒`,
      description: `${toy.title} has been added to your cart.`,
    });
  };

  const handleQuickRent = () => {
    if (!toy) return;

    handleAddToCart();
    toast({
      title: "Quick Rent Started! ⚡",
      description: `${toy.title} - proceeding to checkout.`,
    });

    router.push("/checkout");
  };

  const toggleWishlist = () => {
    if (!toy) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let newWishlist;

    if (isWishlisted) {
      newWishlist = wishlist.filter((id: number) => id !== toy.id);
    } else {
      newWishlist = [...wishlist, toy.id];
    }

    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);

    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${toy.title} ${
        isWishlisted ? "removed from" : "added to"
      } your wishlist.`,
    });
  };

  const handleShare = async () => {
    if (!toy) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: toy.title,
          text: toy.desc,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard.",
      });
    }
  };

  const nextImage = () => {
    if (!toy?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === toy.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!toy?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? toy.images.length - 1 : prev - 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading toy details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !toy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Toy Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The toy you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.push("/browse")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => router.push("/browse")}
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{toy.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                {toy.images && toy.images.length > 0 ? (
                  <>
                    {toy.images &&
                    toy.images.length > 0 &&
                    toy.images[currentImageIndex] ? (
                      <img
                        src={toy.images[currentImageIndex]}
                        alt={toy.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          // Show fallback
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback for broken/missing images */}
                    <div
                      className="w-full h-full bg-gray-200 flex items-center justify-center"
                      style={{
                        display:
                          toy.images && toy.images.length > 0 ? "none" : "flex",
                      }}
                    >
                      <Camera className="w-16 h-16 text-gray-400" />
                    </div>

                    {/* Navigation Arrows */}
                    {toy.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    {toy.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {toy.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {toy.images && toy.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {toy.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${toy.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={`${
                      toy.isAvailable
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {toy.isAvailable ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Currently Rented
                      </>
                    )}
                  </Badge>

                  <Badge variant="outline">
                    <Building className="w-3 h-3 mr-1" />
                    {toy.manufacturer}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {toy.title}
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {toy.desc}
                </p>
              </div>

              {/* Price and Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Rental Price
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {toy.value.toLocaleString()} KZT
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleWishlist}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Quantity Selector (if needed) */}
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!toy.isAvailable}
                    variant="outline"
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    onClick={handleQuickRent}
                    disabled={!toy.isAvailable}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Rent
                  </Button>
                </div>

                {!toy.isAvailable && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800">
                      <Info className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        This toy is currently rented. Check back later or add to
                        wishlist.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Age Range</span>
                  </div>
                  <p className="text-lg">{toy.recommendedAge}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Brand</span>
                  </div>
                  <p className="text-lg">{toy.manufacturer}</p>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {toy.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                  Skills Developed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {toy.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Safety Assured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All toys are thoroughly sanitized and safety-checked before
                  each rental.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  Easy Pickup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Convenient pickup locations across Almaty. Free delivery for
                  orders over 10,000 KZT.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Quality Guaranteed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Premium toys from trusted brands. If you're not satisfied,
                  we'll make it right.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main component with Suspense wrapper
export default function ToyDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading toy details...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ToyDetailsContent />
    </Suspense>
  );
}
