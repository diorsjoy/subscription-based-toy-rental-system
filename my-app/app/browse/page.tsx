// app/browse/page.tsx - Fixed version
"use client";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useCart } from "@/components/cart";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  Star,
  Clock,
  Users,
  Zap,
  Gift,
  BookOpen,
  Puzzle,
  Car,
  Brush,
  Music,
  Calculator,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

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
}

const toyCategories = [
  {
    id: "all",
    name: "All Toys",
    icon: <Grid className="w-4 h-4" />,
    count: 156,
  },
  {
    id: "educational",
    name: "Educational",
    icon: <BookOpen className="w-4 h-4" />,
    count: 45,
  },
  {
    id: "building",
    name: "Building & Construction",
    icon: <Puzzle className="w-4 h-4" />,
    count: 38,
  },
  {
    id: "vehicles",
    name: "Vehicles & Transport",
    icon: <Car className="w-4 h-4" />,
    count: 24,
  },
  {
    id: "arts",
    name: "Arts & Crafts",
    icon: <Brush className="w-4 h-4" />,
    count: 32,
  },
  {
    id: "music",
    name: "Musical Instruments",
    icon: <Music className="w-4 h-4" />,
    count: 18,
  },
  {
    id: "stem",
    name: "STEM & Science",
    icon: <Calculator className="w-4 h-4" />,
    count: 29,
  },
];

const toys: Toy[] = [
  {
    id: 1,
    title: "LEGO Architecture Burj Khalifa",
    description:
      "Build the world's tallest building with this detailed LEGO set featuring authentic architectural details.",
    ageRange: "12+ years",
    ageMin: 12,
    ageMax: 99,
    category: "building",
    rating: 4.9,
    tokens: 85,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
    isFeatured: true,
    difficulty: "Hard",
    playTime: "4-6 hours",
    playerCount: "1-2 players",
    skills: ["Engineering", "Patience", "Attention to Detail"],
    brand: "LEGO",
    availability: "Available",
  },
  {
    id: 2,
    title: "Melissa & Doug Deluxe Kitchen Set",
    description:
      "Complete wooden kitchen playset with realistic sounds, lights, and 25+ accessories.",
    ageRange: "3-8 years",
    ageMin: 3,
    ageMax: 8,
    category: "pretend",
    rating: 4.8,
    tokens: 75,
    image: "/placeholder.svg?height=400&width=400",
    isFeatured: true,
    difficulty: "Easy",
    playTime: "1-3 hours",
    playerCount: "1-4 players",
    skills: ["Imagination", "Social Skills", "Role Play"],
    brand: "Melissa & Doug",
    availability: "Available",
  },
  {
    id: 3,
    title: "National Geographic Break Open Geodes Kit",
    description:
      "Crack open real geodes to discover beautiful crystals inside. Includes safety goggles and learning guide.",
    ageRange: "6-12 years",
    ageMin: 6,
    ageMax: 12,
    category: "stem",
    rating: 4.7,
    tokens: 55,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
    difficulty: "Medium",
    playTime: "2-4 hours",
    playerCount: "1-3 players",
    skills: ["Science", "Discovery", "Geology"],
    brand: "National Geographic",
    availability: "Limited",
  },
  {
    id: 4,
    title: "Crayola Light-Up Tracing Pad Deluxe",
    description:
      "LED-powered drawing tablet with 100+ tracing sheets and colored pencils for creative art projects.",
    ageRange: "5+ years",
    ageMin: 5,
    ageMax: 12,
    category: "arts",
    rating: 4.6,
    tokens: 45,
    image: "/placeholder.svg?height=400&width=400",
    difficulty: "Easy",
    playTime: "1-2 hours",
    playerCount: "1 player",
    skills: ["Creativity", "Fine Motor", "Art"],
    brand: "Crayola",
    availability: "Available",
  },
  {
    id: 5,
    title: "VTech KidiBeats Kids Drum Set",
    description:
      "Electronic drum kit with light-up drums, multiple sound effects, and learning songs.",
    ageRange: "2-5 years",
    ageMin: 2,
    ageMax: 5,
    category: "music",
    rating: 4.5,
    tokens: 65,
    image: "/placeholder.svg?height=400&width=400",
    difficulty: "Easy",
    playTime: "30min-1hour",
    playerCount: "1 player",
    skills: ["Music", "Rhythm", "Coordination"],
    brand: "VTech",
    availability: "Available",
  },
  {
    id: 6,
    title: "Tesla Cybertruck RC Model",
    description:
      "Remote-controlled Cybertruck with working headlights, authentic design, and app connectivity.",
    ageRange: "8+ years",
    ageMin: 8,
    ageMax: 16,
    category: "vehicles",
    rating: 4.8,
    tokens: 95,
    image: "/placeholder.svg?height=400&width=400",
    isNew: true,
    isFeatured: true,
    difficulty: "Medium",
    playTime: "1-3 hours",
    playerCount: "1-2 players",
    skills: ["Technology", "Control", "Engineering"],
    brand: "Tesla",
    availability: "Coming Soon",
  },
];

export default function EnhancedBrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tokenRange, setTokenRange] = useState([0, 100]);
  const [ageRange, setAgeRange] = useState([0, 16]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filteredToys, setFilteredToys] = useState(toys);
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Filter and sort toys
  useEffect(() => {
    let filtered = toys.filter((toy) => {
      const matchesCategory =
        selectedCategory === "all" || toy.category === selectedCategory;
      const matchesSearch =
        toy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toy.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTokens =
        toy.tokens >= tokenRange[0] && toy.tokens <= tokenRange[1];
      const matchesAge = toy.ageMin <= ageRange[1] && toy.ageMax >= ageRange[0];
      const matchesDifficulty =
        selectedDifficulty.length === 0 ||
        selectedDifficulty.includes(toy.difficulty);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesTokens &&
        matchesAge &&
        matchesDifficulty
      );
    });

    // Sort toys
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.tokens - b.tokens;
        case "price-high":
          return b.tokens - a.tokens;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredToys(filtered);
  }, [
    selectedCategory,
    searchTerm,
    tokenRange,
    ageRange,
    selectedDifficulty,
    sortBy,
  ]);

  const handleToyClick = (toyId: number) => {
    router.push(`/toy-details?id=${toyId}`);
  };

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

  // Fixed cart integration - using the correct properties expected by your cart
  const handleAddToCart = (toy: Toy) => {
    // Match your existing cart item structure from the original browse page
    const cartItem = {
      id: toy.id,
      title: toy.title, // Use 'title' instead of 'name'
      description: toy.description,
      ageRange: toy.ageRange,
      category: toy.category,
      rating: toy.rating,
      tokens: toy.tokens,
      image: toy.image,
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart! 🛒",
      description: `${toy.title} has been added to your cart.`,
    });
  };

  const handleQuickRent = (toy: Toy) => {
    // Same structure as handleAddToCart
    const cartItem = {
      id: toy.id,
      title: toy.title,
      description: toy.description,
      ageRange: toy.ageRange,
      category: toy.category,
      rating: toy.rating,
      tokens: toy.tokens,
      image: toy.image,
    };

    addItem(cartItem);
    toast({
      title: "Quick Rent Started! ⚡",
      description: `${toy.title} - proceeding to checkout.`,
    });

    // Navigate to checkout in a real app
    // router.push('/checkout');
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setTokenRange([0, 100]);
    setAgeRange([0, 16]);
    setSelectedDifficulty([]);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none futuristic-grid-bg" />

      <Navigation />
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Discover Amazing Toys
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Browse Our Collection
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore over 150+ carefully curated toys designed to inspire,
                educate, and entertain children of all ages.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <Card className="sticky top-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Toys</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Categories</label>
                    <div className="space-y-2">
                      {toyCategories.map((category) => (
                        <button
                          key={category.id}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selectedCategory === category.id
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2 text-sm font-medium">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Token Range</label>
                    <div className="px-2">
                      <Slider
                        value={tokenRange}
                        onValueChange={setTokenRange}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{tokenRange[0]} tokens</span>
                        <span>{tokenRange[1]} tokens</span>
                      </div>
                    </div>
                  </div>

                  {/* Age Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Age Range</label>
                    <div className="px-2">
                      <Slider
                        value={ageRange}
                        onValueChange={setAgeRange}
                        max={16}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{ageRange[0]} years</span>
                        <span>{ageRange[1]}+ years</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Difficulty</label>
                    <div className="space-y-2">
                      {["Easy", "Medium", "Hard"].map((difficulty) => (
                        <label key={difficulty} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDifficulty.includes(difficulty)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDifficulty([
                                  ...selectedDifficulty,
                                  difficulty,
                                ]);
                              } else {
                                setSelectedDifficulty(
                                  selectedDifficulty.filter(
                                    (d) => d !== difficulty
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{filteredToys.length}</span>{" "}
                    toys found
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Toys Grid/List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredToys.map((toy, index) => (
                    <motion.div
                      key={toy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {viewMode === "grid" ? (
                        <Card
                          className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                          onClick={() => handleToyClick(toy.id)}
                        >
                          <CardHeader className="p-0 relative">
                            {/* Badges */}
                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                              {toy.isNew && (
                                <Badge className="bg-green-600 hover:bg-green-700">
                                  <Zap className="w-3 h-3 mr-1" />
                                  New
                                </Badge>
                              )}
                              {toy.isFeatured && (
                                <Badge className="bg-purple-600 hover:bg-purple-700">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={`${
                                  toy.availability === "Available"
                                    ? "bg-green-100 text-green-700"
                                    : toy.availability === "Limited"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {toy.availability}
                              </Badge>
                            </div>

                            {/* Wishlist */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white"
                              onClick={() => toggleWishlist(toy.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  wishlist.includes(toy.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                                }`}
                              />
                            </Button>

                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={toy.image}
                                alt={toy.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </CardHeader>

                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                  {toy.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                  {toy.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {toy.ageRange}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {toy.playTime}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-1 text-sm font-medium">
                                    {toy.rating}
                                  </span>
                                </div>
                                <Badge
                                  variant={
                                    toy.difficulty === "Easy"
                                      ? "secondary"
                                      : toy.difficulty === "Medium"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {toy.difficulty}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {toy.skills.slice(0, 2).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {toy.skills.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{toy.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-4 pt-0 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-blue-600">
                                {toy.tokens}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                tokens
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click
                                  handleAddToCart(toy);
                                }}
                                disabled={toy.availability === "Coming Soon"}
                              >
                                Add to Cart
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleQuickRent(toy)}
                                disabled={toy.availability === "Coming Soon"}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                <Zap className="w-4 h-4 mr-1" />
                                Quick Rent
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ) : (
                        // List View
                        <Card
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleToyClick(toy.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative w-24 h-24 flex-shrink-0">
                                <Image
                                  src={toy.image}
                                  alt={toy.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {toy.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {toy.description}
                                    </p>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      <span>{toy.ageRange}</span>
                                      <span>•</span>
                                      <span>{toy.playTime}</span>
                                      <span>•</span>
                                      <div className="flex items-center">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                        {toy.rating}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click
                                        toggleWishlist(toy.id);
                                      }}
                                    >
                                      <Heart
                                        className={`w-4 h-4 ${
                                          wishlist.includes(toy.id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-600"
                                        }`}
                                      />
                                    </Button>

                                    <div className="text-right">
                                      <div className="text-xl font-bold text-blue-600">
                                        {toy.tokens} tokens
                                      </div>
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleAddToCart(toy)}
                                          disabled={
                                            toy.availability === "Coming Soon"
                                          }
                                        >
                                          Add to Cart
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleQuickRent(toy);
                                          }}
                                          disabled={
                                            toy.availability === "Coming Soon"
                                          }
                                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                          <Zap className="w-4 h-4 mr-1" />
                                          Quick Rent
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* No Results */}
              {filteredToys.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No toys found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
