// app/browse/page.tsx - Enhanced with Real API Integration
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
  Users,
  Zap,
  Gift,
  BookOpen,
  Puzzle,
  Car,
  Brush,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Package,
  Camera,
} from "lucide-react";
// Using regular img tag instead of Next.js Image for external URLs

// API Types matching your backend
interface Toy {
  id: number;
  title: string;
  desc: string; // Backend uses 'desc' instead of 'description'
  value: number; // Backend uses 'value' for token cost
  images: string[];
  skills: string[];
  categories: string[];
  recommendedAge: string;
  manufacturer: string;
  isAvailable: boolean;
}

interface ApiFilters {
  page?: string;
  pageSize?: string;
  sort?: string;
  title?: string;
  from?: string;
  to?: string;
  categories?: string[];
  skills?: string[];
}

interface ApiMetadata {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
}

interface ApiResponse {
  toys: Toy[];
  metadata: ApiMetadata;
  status: string;
  errorMsg?: string;
}

// Backend API integration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL1 || "http://localhost:3030";

// Use AuthContext for token management
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

// API calls
const createToyAPI = (getHeaders: () => Record<string, string>) => ({
  listToys: async (filters: ApiFilters = {}): Promise<ApiResponse> => {
    const params = new URLSearchParams({
      page: filters.page || "1",
      pageSize: filters.pageSize || "20",
      sort: filters.sort || "id",
      title: filters.title || "",
      from: filters.from || "0",
      to: filters.to || "150000",
    });

    if (filters.categories?.length) {
      filters.categories.forEach((cat: string) =>
        params.append("categories", cat)
      );
    }
    if (filters.skills?.length) {
      filters.skills.forEach((skill: string) => params.append("skills", skill));
    }

    const response = await fetch(`${API_BASE_URL}/toys?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch toys: ${response.status}`);
    }
    return response.json();
  },

  getToy: async (toyId: number): Promise<{ toy: Toy }> => {
    const response = await fetch(`${API_BASE_URL}/toys/${toyId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch toy: ${response.status}`);
    }
    return response.json();
  },
});

// Categories from your backend
const toyCategories = [
  {
    id: "all",
    name: "All Toys",
    icon: <Grid className="w-4 h-4" />,
  },
  {
    id: "Educational",
    name: "Educational",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "Building Sets",
    name: "Building Sets",
    icon: <Puzzle className="w-4 h-4" />,
  },
  {
    id: "Action Figures",
    name: "Action Figures",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "Dolls & Accessories",
    name: "Dolls & Accessories",
    icon: <Gift className="w-4 h-4" />,
  },
  {
    id: "Board Games",
    name: "Board Games",
    icon: <Puzzle className="w-4 h-4" />,
  },
  {
    id: "Outdoor Toys",
    name: "Outdoor Toys",
    icon: <Car className="w-4 h-4" />,
  },
  {
    id: "Electronic Toys",
    name: "Electronic Toys",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "Arts & Crafts",
    name: "Arts & Crafts",
    icon: <Brush className="w-4 h-4" />,
  },
];

// Skills from your backend
const skillOptions = [
  "Problem Solving",
  "Creativity",
  "Motor Skills",
  "Social Skills",
  "Logic",
  "Imagination",
  "Coordination",
  "Memory",
  "Engineering",
];

export default function EnhancedBrowsePage() {
  const getHeaders = useApiHeaders();
  const toyAPI = createToyAPI(getHeaders);

  // State
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState<ApiMetadata>({
    totalRecords: 0,
    currentPage: 1,
    pageSize: 20,
    firstPage: 1,
    lastPage: 1,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tokenRange, setTokenRange] = useState([0, 150000]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("id");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Load toys when filters change
  useEffect(() => {
    loadToys();
  }, [
    selectedCategory,
    searchTerm,
    tokenRange,
    selectedSkills,
    sortBy,
    currentPage,
  ]);

  // const loadToys = async (): Promise<void> => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const filters: ApiFilters = {
  //       page: currentPage.toString(),
  //       pageSize: "20",
  //       title: searchTerm,
  //       from: tokenRange[0].toString(),
  //       to: tokenRange[1].toString(),
  //       categories: selectedCategory === "all" ? [] : [selectedCategory],
  //       skills: selectedSkills,
  //       sort: sortBy,
  //     };

  //     const response = await toyAPI.listToys(filters);
  //     setToys(response.toys || []);
  //     setMetadata(
  //       response.metadata || {
  //         totalRecords: 0,
  //         currentPage: 1,
  //         pageSize: 20,
  //         firstPage: 1,
  //         lastPage: 1,
  //       }
  //     );
  //   } catch (err: unknown) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Unknown error occurred";
  //     setError("Failed to load toys: " + errorMessage);
  //     toast({
  //       title: "Error Loading Toys",
  //       description: errorMessage,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadToys = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const filters: ApiFilters = {
        page: currentPage.toString(),
        pageSize: "20",
        title: searchTerm,
        from: tokenRange[0].toString(),
        to: tokenRange[1].toString(),
        categories: selectedCategory === "all" ? [] : [selectedCategory],
        skills: selectedSkills,
        sort: sortBy,
      };

      console.log("🔍 Loading toys with filters:", filters);
      const response = await toyAPI.listToys(filters);
      console.log("📋 List API response:", response);

      // Check if list response has proper images
      const listToys = response.toys || [];
      console.log(
        "🧸 Toys from list endpoint:",
        listToys.map((t) => ({
          id: t.id,
          title: t.title,
          images: t.images,
          imageCount: t.images?.length || 0,
        }))
      );

      // SOLUTION 1: If list endpoint doesn't have images, fetch details for first few toys
      const toysWithImages = await Promise.all(
        listToys.slice(0, 10).map(async (toy: Toy) => {
          // Limit to first 10 for performance
          // Check if this toy already has images
          if (toy.images && toy.images.length > 0) {
            console.log(`✅ Toy ${toy.id} already has images:`, toy.images);
            return toy;
          }

          // If no images, fetch from details endpoint
          try {
            console.log(
              `🔍 Fetching details for toy ${toy.id} (no images in list)`
            );
            const detailResponse = await toyAPI.getToy(toy.id);
            const detailedToy = detailResponse.toy;

            console.log(`🎯 Got details for toy ${toy.id}:`, {
              images: detailedToy.images,
              imageCount: detailedToy.images?.length || 0,
            });

            return detailedToy;
          } catch (error) {
            console.error(`❌ Failed to get details for toy ${toy.id}:`, error);
            return toy; // Return original toy if details fetch fails
          }
        })
      );

      // Add remaining toys without fetching details (for performance)
      const remainingToys = listToys.slice(10);
      const allToys = [...toysWithImages, ...remainingToys];

      console.log(
        "🎯 Final toys with images:",
        allToys.map((t) => ({
          id: t.id,
          title: t.title,
          images: t.images,
          imageCount: t.images?.length || 0,
        }))
      );

      setToys(allToys);
      setMetadata(
        response.metadata || {
          totalRecords: 0,
          currentPage: 1,
          pageSize: 20,
          firstPage: 1,
          lastPage: 1,
        }
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to load toys: " + errorMessage);
      console.error("🔥 Load toys error:", err);
      toast({
        title: "Error Loading Toys",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  // Convert backend toy data to cart format
  const handleAddToCart = async (toy: Toy) => {
    try {
      const success = await addItem(toy.id, 1); // Pass toyId and quantity
      if (success) {
        toast({
          title: "Added to Cart! 🛒",
          description: `${toy.title} has been added to your cart.`,
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setTokenRange([0, 150000]);
    setSelectedSkills([]);
    setSortBy("id");
    setCurrentPage(1);
  };

  // Calculate category counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return metadata.totalRecords;
    // In a real implementation, you might want to make separate API calls to get counts
    return toys.filter((toy) => toy.categories.includes(categoryId)).length;
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
                Explore {metadata.totalRecords}+ carefully curated toys designed
                to inspire, educate, and entertain children of all ages.
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
                            {getCategoryCount(category.id)}
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
                        max={150000}
                        min={0}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{tokenRange[0].toLocaleString()} tokens</span>
                        <span>{tokenRange[1].toLocaleString()} tokens</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Skills</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {skillOptions.map((skill) => (
                        <label key={skill} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm">{skill}</span>
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

                  <Button
                    variant="outline"
                    onClick={loadToys}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{toys.length}</span> of{" "}
                    <span className="font-medium">{metadata.totalRecords}</span>{" "}
                    toys
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
                    <option value="id">Default</option>
                    <option value="title">Name: A to Z</option>
                    <option value="value">Price: Low to High</option>
                    <option value="-value">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                  <Button variant="ghost" size="sm" onClick={loadToys}>
                    Retry
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading toys...</span>
                </div>
              )}

              {/* Toys Grid/List */}
              {!loading && (
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
                    {toys.map((toy, index) => (
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
                              {/* Availability Badge */}
                              <div className="absolute top-3 left-3 z-10">
                                <Badge
                                  className={`${
                                    toy.isAvailable
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-red-600 hover:bg-red-700"
                                  }`}
                                >
                                  {/* {toy.isAvailable ? "Available" : "Rented"} */}
                                </Badge>
                              </div>

                              {/* Wishlist */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white"
                                onClick={(e) => {
                                  e.stopPropagation();
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

                              {/* Image */}
                              <div className="relative h-48 overflow-hidden">
                                {toy.images && toy.images[0] ? (
                                  <img
                                    src={toy.images[0]}
                                    alt={toy.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      // Hide broken image and show fallback
                                      e.currentTarget.style.display = "none";
                                      const fallback =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".image-fallback"
                                        );
                                      if (fallback) {
                                        (
                                          fallback as HTMLElement
                                        ).style.display = "flex";
                                      }
                                    }}
                                    onLoad={(e) => {
                                      // Ensure fallback is hidden when image loads
                                      const fallback =
                                        e.currentTarget.parentElement?.querySelector(
                                          ".image-fallback"
                                        );
                                      if (fallback) {
                                        (
                                          fallback as HTMLElement
                                        ).style.display = "none";
                                      }
                                    }}
                                  />
                                ) : null}

                                {/* Fallback for missing/broken images */}
                                <div
                                  className={`image-fallback w-full h-full bg-gray-200 flex items-center justify-center ${
                                    toy.images && toy.images[0]
                                      ? "hidden"
                                      : "flex"
                                  }`}
                                >
                                  <Camera className="w-12 h-12 text-gray-400" />
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div>
                                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                    {toy.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                    {toy.desc}
                                  </p>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {toy.recommendedAge}
                                  </div>
                                  <div className="flex items-center">
                                    <Package className="w-4 h-4 mr-1" />
                                    {toy.manufacturer}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {toy.categories
                                    .slice(0, 2)
                                    .map((category) => (
                                      <Badge
                                        key={category}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {category}
                                      </Badge>
                                    ))}
                                  {toy.categories.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{toy.categories.length - 2}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {toy.skills.slice(0, 2).map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                  {toy.skills.length > 2 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{toy.skills.length - 2} skills
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-blue-600">
                                  {toy.value.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">
                                  KZT
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(toy);
                                  }}
                                  disabled={!toy.isAvailable}
                                >
                                  Add to Cart
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
                                  {toy.images && toy.images[0] ? (
                                    <img
                                      src={toy.images[0]}
                                      alt={toy.title}
                                      className="w-full h-full object-cover rounded-lg"
                                      onError={(e) => {
                                        // Hide broken image and show fallback
                                        e.currentTarget.style.display = "none";
                                        const fallback =
                                          e.currentTarget.parentElement?.querySelector(
                                            ".list-image-fallback"
                                          );
                                        if (fallback) {
                                          (
                                            fallback as HTMLElement
                                          ).style.display = "flex";
                                        }
                                      }}
                                      onLoad={(e) => {
                                        // Ensure fallback is hidden when image loads
                                        const fallback =
                                          e.currentTarget.parentElement?.querySelector(
                                            ".list-image-fallback"
                                          );
                                        if (fallback) {
                                          (
                                            fallback as HTMLElement
                                          ).style.display = "none";
                                        }
                                      }}
                                    />
                                  ) : null}

                                  {/* Fallback for list view */}
                                  <div
                                    className={`list-image-fallback w-full h-full bg-gray-200 rounded-lg flex items-center justify-center ${
                                      toy.images && toy.images[0]
                                        ? "hidden"
                                        : "flex"
                                    }`}
                                  >
                                    <Camera className="w-6 h-6 text-gray-400" />
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">
                                        {toy.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {toy.desc}
                                      </p>

                                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span>{toy.recommendedAge}</span>
                                        <span>•</span>
                                        <span>{toy.manufacturer}</span>
                                        <span>•</span>
                                        <Badge
                                          variant={
                                            toy.isAvailable
                                              ? "default"
                                              : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {/* {toy.isAvailable
                                            ? "Available"
                                            : "Rented"} */}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
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
                                          {toy.value.toLocaleString()} KZT
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddToCart(toy);
                                            }}
                                            disabled={!toy.isAvailable}
                                          >
                                            Add to Cart
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
              )}

              {/* No Results */}
              {!loading && toys.length === 0 && (
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

              {/* Pagination */}
              {!loading && metadata.totalRecords > 0 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * 20 + 1} to{" "}
                    {Math.min(currentPage * 20, metadata.totalRecords)} of{" "}
                    {metadata.totalRecords} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, metadata.lastPage) },
                        (_, i) => {
                          const pageNum = Math.max(
                            1,
                            Math.min(metadata.lastPage, currentPage - 2 + i)
                          );
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === currentPage ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(
                          Math.min(metadata.lastPage || 1, currentPage + 1)
                        )
                      }
                      disabled={currentPage >= (metadata.lastPage || 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
