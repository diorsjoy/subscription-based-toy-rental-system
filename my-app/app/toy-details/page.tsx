// app/toy-details/page.tsx
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useCart } from "@/components/cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  Clock,
  Users,
  Zap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  Target,
  BookOpen,
  Palette,
  Music,
  Car,
  Calculator,
  Grid,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

interface Toy {
  id: number;
  title: string;
  description: string;
  ageRange: string;
  ageMin: number;
  ageMax: number;
  category: string;
  rating: number;
  tokens: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  playTime: string;
  playerCount: string;
  skills: string[];
  brand: string;
  availability: "Available" | "Limited" | "Coming Soon";
  detailedDescription?: string;
  features?: string[];
  dimensions?: string;
  weight?: string;
  materials?: string[];
  safetyInfo?: string[];
  careInstructions?: string[];
  rentalPeriods?: {
    period: string;
    tokens: number;
    popular?: boolean;
  }[];
  reviews?: {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
  }[];
  relatedToys?: number[];
}

const detailedToys: Toy[] = [
  {
    id: 1,
    title: "LEGO Architecture Burj Khalifa",
    description:
      "Build the world's tallest building with this detailed LEGO set featuring authentic architectural details.",
    detailedDescription:
      "Experience the architectural marvel of Dubai's iconic Burj Khalifa with this meticulously designed LEGO set. Standing over 39 inches tall when complete, this model captures the essence of the world's tallest building with incredible attention to detail.",
    ageRange: "12+ years",
    ageMin: 12,
    ageMax: 99,
    category: "building",
    rating: 4.9,
    tokens: 85,
    image: "/images/lego-dog.png",
    isNew: true,
    isFeatured: true,
    difficulty: "Hard",
    playTime: "4-6 hours",
    playerCount: "1-2 players",
    skills: ["Engineering", "Patience", "Attention to Detail", "Architecture"],
    brand: "LEGO",
    availability: "Available",
    features: [
      "Over 333 pieces included",
      "Detailed instruction booklet",
      "Authentic architectural proportions",
      "Displayable base with nameplate",
      "Premium building experience",
    ],
    dimensions: "8 x 8 x 39 inches when built",
    weight: "1.2 kg",
    materials: ["High-quality ABS plastic", "Paper instruction manual"],
    safetyInfo: [
      "Not suitable for children under 3 years",
      "Contains small parts - choking hazard",
      "Adult supervision recommended for ages 3-12",
    ],
    careInstructions: [
      "Clean with damp cloth only",
      "Do not submerge in water",
      "Store in dry place",
      "Handle with care to prevent breakage",
    ],
    rentalPeriods: [
      { period: "3 days", tokens: 25 },
      { period: "1 week", tokens: 45, popular: true },
      { period: "2 weeks", tokens: 85 },
      { period: "1 month", tokens: 150 },
    ],
    reviews: [
      {
        id: 1,
        userName: "ArchitectureFan23",
        rating: 5,
        comment:
          "Absolutely stunning build! The detail is incredible and it looks amazing on my shelf. Worth every token!",
        date: "2024-12-15",
        helpful: 12,
      },
      {
        id: 2,
        userName: "LEGOMaster",
        rating: 5,
        comment:
          "Challenging but rewarding build. Great quality pieces and clear instructions.",
        date: "2024-12-10",
        helpful: 8,
      },
    ],
    relatedToys: [2, 3, 6],
  },
  {
    id: 2,
    title: "Melissa & Doug Deluxe Kitchen Set",
    description:
      "Complete wooden kitchen playset with realistic sounds, lights, and 25+ accessories.",
    detailedDescription:
      "Transform playtime into culinary adventures with this premium wooden kitchen set. Featuring realistic sounds, LED lights, and over 25 accessories, this kitchen provides endless opportunities for creative play.",
    ageRange: "3-8 years",
    ageMin: 3,
    ageMax: 8,
    category: "pretend",
    rating: 4.8,
    tokens: 75,
    image: "/placeholder.svg?height=600&width=600",
    isFeatured: true,
    difficulty: "Easy",
    playTime: "1-3 hours",
    playerCount: "1-4 players",
    skills: ["Imagination", "Social Skills", "Role Play", "Fine Motor Skills"],
    brand: "Melissa & Doug",
    availability: "Available",
    features: [
      "Realistic cooking sounds and lights",
      "25+ play accessories included",
      "Sustainable wood construction",
      "Child-safe, non-toxic finishes",
      "Easy assembly with included tools",
    ],
    dimensions: "43 x 37 x 109 cm",
    weight: "15 kg",
    materials: ["Sustainable wood", "Non-toxic paint", "Electronic components"],
    safetyInfo: [
      "Suitable for ages 3 and up",
      "Meets all safety standards",
      "Rounded edges for safety",
      "Stable construction",
    ],
    careInstructions: [
      "Wipe clean with damp cloth",
      "Avoid harsh chemicals",
      "Check electronic components regularly",
      "Store in dry environment",
    ],
    rentalPeriods: [
      { period: "3 days", tokens: 22 },
      { period: "1 week", tokens: 40, popular: true },
      { period: "2 weeks", tokens: 75 },
      { period: "1 month", tokens: 130 },
    ],
    reviews: [
      {
        id: 1,
        userName: "PlayMom",
        rating: 5,
        comment:
          "My daughter absolutely loves this kitchen! The sounds and lights make it so realistic. Great quality too.",
        date: "2024-12-18",
        helpful: 15,
      },
    ],
    relatedToys: [4, 5],
  },
  {
    id: 3,
    title: "National Geographic Break Open Geodes Kit",
    description:
      "Crack open real geodes to discover beautiful crystals inside. Includes safety goggles and learning guide.",
    detailedDescription:
      "Embark on a geological adventure with this authentic geode kit from National Geographic. Each kit contains 10 real geodes waiting to be cracked open to reveal stunning crystals inside.",
    ageRange: "6-12 years",
    ageMin: 6,
    ageMax: 12,
    category: "stem",
    rating: 4.7,
    tokens: 55,
    image: "/placeholder.svg?height=600&width=600",
    isNew: true,
    difficulty: "Medium",
    playTime: "2-4 hours",
    playerCount: "1-3 players",
    skills: ["Science", "Discovery", "Geology", "Observation"],
    brand: "National Geographic",
    availability: "Limited",
    features: [
      "10 authentic geodes included",
      "Safety goggles and tools",
      "Full-color learning guide",
      "Magnifying glass included",
      "Display stand for crystals",
    ],
    dimensions: "30 x 20 x 8 cm",
    weight: "1.5 kg",
    materials: ["Natural geodes", "Safety equipment", "Educational materials"],
    safetyInfo: [
      "Adult supervision required",
      "Always wear safety goggles",
      "Use tools carefully",
      "Work in well-ventilated area",
    ],
    careInstructions: [
      "Store tools in provided case",
      "Keep crystals in dry place",
      "Handle with care",
      "Clean tools after use",
    ],
    rentalPeriods: [
      { period: "3 days", tokens: 15 },
      { period: "1 week", tokens: 30, popular: true },
      { period: "2 weeks", tokens: 55 },
      { period: "1 month", tokens: 95 },
    ],
    reviews: [
      {
        id: 1,
        userName: "ScienceMom",
        rating: 5,
        comment:
          "Amazing educational experience! My son learned so much about geology while having fun.",
        date: "2024-12-20",
        helpful: 18,
      },
    ],
    relatedToys: [1, 6],
  },
];

const categoryIcons: { [key: string]: JSX.Element } = {
  building: <Grid className="w-4 h-4" />,
  pretend: <Users className="w-4 h-4" />,
  stem: <Calculator className="w-4 h-4" />,
  arts: <Palette className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  vehicles: <Car className="w-4 h-4" />,
  educational: <BookOpen className="w-4 h-4" />,
};

export default function ToyDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toyId = searchParams.get("id");
  const [currentToy, setCurrentToy] = useState<Toy | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "rental">(
    "overview"
  );
  const [selectedRentalPeriod, setSelectedRentalPeriod] =
    useState<string>("1 week");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (toyId) {
      const toy = detailedToys.find((t) => t.id === parseInt(toyId));
      if (toy) {
        setCurrentToy(toy);
        const popularPeriod = toy.rentalPeriods?.find((p) => p.popular);
        if (popularPeriod) {
          setSelectedRentalPeriod(popularPeriod.period);
        }
      } else {
        setCurrentToy(detailedToys[0]);
      }
    } else {
      setCurrentToy(detailedToys[0]);
    }
  }, [toyId]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );

    toast({
      title: wishlist.includes(id)
        ? "Removed from Wishlist"
        : "Added to Wishlist",
      description: `Toy ${
        wishlist.includes(id) ? "removed from" : "added to"
      } your wishlist.`,
    });
  };

  const handleAddToCart = (toy: Toy) => {
    const rentalPeriod = toy.rentalPeriods?.find(
      (p) => p.period === selectedRentalPeriod
    );
    const cartItem = {
      id: toy.id,
      title: toy.title,
      description: toy.description,
      ageRange: toy.ageRange,
      category: toy.category,
      rating: toy.rating,
      tokens: rentalPeriod?.tokens || toy.tokens,
      image: toy.image,
      rentalPeriod: selectedRentalPeriod,
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart! 🛒",
      description: `${toy.title} (${selectedRentalPeriod}) has been added to your cart.`,
    });
  };

  const handleShare = () => {
    if (navigator.share && currentToy) {
      navigator.share({
        title: currentToy.title,
        text: currentToy.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Toy page link copied to clipboard.",
      });
    }
  };

  if (!currentToy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading toy details...</p>
        </div>
      </div>
    );
  }

  const selectedRental = currentToy.rentalPeriods?.find(
    (p) => p.period === selectedRentalPeriod
  );
  const relatedToys = detailedToys.filter((toy) =>
    currentToy.relatedToys?.includes(toy.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none futuristic-grid-bg" />

      <Navigation />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Image
                      src={currentToy.image}
                      alt={currentToy.title}
                      fill
                      className="object-cover"
                      onLoad={() => setImageLoading(false)}
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {currentToy.isNew && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          <Zap className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {currentToy.isFeatured && (
                        <Badge className="bg-purple-600 hover:bg-purple-700">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => toggleWishlist(currentToy.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlist.includes(currentToy.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {categoryIcons[currentToy.category]}
                  <Badge variant="outline">{currentToy.category}</Badge>
                  <Badge variant="outline">{currentToy.brand}</Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {currentToy.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-lg font-semibold">
                      {currentToy.rating}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({currentToy.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <Badge
                    variant={
                      currentToy.availability === "Available"
                        ? "default"
                        : currentToy.availability === "Limited"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      currentToy.availability === "Available"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : currentToy.availability === "Limited"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {currentToy.availability}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{currentToy.ageRange}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{currentToy.playTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="w-5 h-5 mr-2" />
                  <span>{currentToy.difficulty}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{currentToy.playerCount}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed">
                  {currentToy.detailedDescription || currentToy.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Skills Developed</h3>
                <div className="flex flex-wrap gap-2">
                  {currentToy.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Rental Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {currentToy.rentalPeriods?.map((period) => (
                      <button
                        key={period.period}
                        className={`p-3 rounded-lg border-2 transition-all relative ${
                          selectedRentalPeriod === period.period
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedRentalPeriod(period.period)}
                      >
                        {period.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500">
                            Popular
                          </Badge>
                        )}
                        <div className="text-sm font-medium">
                          {period.period}
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {period.tokens} tokens
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAddToCart(currentToy)}
                      disabled={currentToy.availability === "Coming Soon"}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Add to Cart -{" "}
                      {selectedRental?.tokens || currentToy.tokens} tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {["overview", "reviews", "rental"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-md capitalize transition-all ${
                      activeTab === tab
                        ? "bg-white shadow-sm text-blue-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentToy.features?.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Dimensions</span>
                          <span className="font-medium">
                            {currentToy.dimensions}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Weight</span>
                          <span className="font-medium">
                            {currentToy.weight}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium">
                            {currentToy.brand}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Safety & Care
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Safety Information
                          </h4>
                          <ul className="space-y-1">
                            {currentToy.safetyInfo?.map((info, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <AlertCircle className="w-3 h-3 mr-2 mt-1 text-orange-500 flex-shrink-0" />
                                {info}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-semibold">
                        {currentToy.rating}
                      </span>
                      <span className="text-gray-500">
                        ({currentToy.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentToy.reviews?.map((review) => (
                      <Card key={review.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium">{review.userName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                            <MessageCircle className="w-4 h-4" />
                            Reply
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
              )}

              {activeTab === "rental" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Rental Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Pickup & Delivery
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Free pickup from our Astana location</p>
                        <p>• Home delivery available for 10 tokens</p>
                        <p>• Same-day delivery within city limits</p>
                        <p>• Contactless pickup/delivery options</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Return Policy
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Return by end of rental period</p>
                        <p>• Late fees: 5 tokens per day</p>
                        <p>• Extend rental anytime online</p>
                        <p>• Full refund if toy is defective</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Care Instructions
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        {currentToy.careInstructions?.map(
                          (instruction, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              {instruction}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Damage Policy</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-2">
                            Please handle with care!
                          </p>
                          <p>
                            Minor wear is expected, but damage fees may apply
                            for:
                          </p>
                          <ul className="mt-2 space-y-1 ml-4 list-disc">
                            <li>Broken or missing pieces</li>
                            <li>Excessive dirt or stains</li>
                            <li>Electronic malfunctions due to misuse</li>
                          </ul>
                          <p className="mt-2">
                            Damage fees are capped at 50% of retail value.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {relatedToys.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedToys.map((toy) => (
                  <motion.div
                    key={toy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/toy-details?id=${toy.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={toy.image}
                            alt={toy.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {toy.isNew && (
                            <Badge className="absolute top-3 left-3 bg-green-600">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                            {toy.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {toy.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 text-sm font-medium">
                                {toy.rating}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {toy.tokens} tokens
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
            <Card className="shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {selectedRental?.tokens || currentToy.tokens} tokens
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedRentalPeriod}
                  </div>
                </div>
                <Button
                  onClick={() => handleAddToCart(currentToy)}
                  disabled={currentToy.availability === "Coming Soon"}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
