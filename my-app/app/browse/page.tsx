"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Filter, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { ToyRecommendations } from "@/components/toy-recommendations";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ToyMarketBanner } from "@/components/toy-market-banner";

const toys = [
  {
    id: 1,
    title: "LEGO City Space Set",
    description:
      "Build and explore an entire space mission with this LEGO City set.",
    ageRange: "6-12 years",
    category: "Building & Construction",
    rating: 4.8,
    tokens: 50,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    title: "Melissa & Doug Wooden Kitchen",
    description: "A realistic play kitchen set for budding young chefs.",
    ageRange: "3-8 years",
    category: "Pretend Play",
    rating: 4.9,
    tokens: 60,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    title: "Magna-Tiles Clear Colors Set",
    description:
      "Colorful magnetic building tiles for endless creative possibilities.",
    ageRange: "3+ years",
    category: "Educational",
    rating: 4.7,
    tokens: 40,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    title: "VTech KidiZoom Creator Cam",
    description: "Digital video camera for kids to create their own content.",
    ageRange: "5-10 years",
    category: "Electronics",
    rating: 4.5,
    tokens: 70,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    title: "Razor A5 Lux Kick Scooter",
    description: "Durable and smooth-riding scooter for outdoor adventures.",
    ageRange: "8+ years",
    category: "Outdoor & Sports",
    rating: 4.6,
    tokens: 55,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 6,
    title: "Crayola Light-Up Tracing Pad",
    description: "LED drawing tablet for budding artists to trace and create.",
    ageRange: "6+ years",
    category: "Arts & Crafts",
    rating: 4.4,
    tokens: 35,
    image: "/placeholder.svg?height=300&width=300",
  },
];

export default function BrowsePage() {
  const [tokenRange, setTokenRange] = useState([0, 100]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (toy: any) => {
    addItem(toy);
    toast({
      title: "Added to Cart",
      description: `${toy.title} has been added to your cart.`,
    });
  };

  const handleBuyNow = (toy: any) => {
    addItem(toy);
    toast({
      title: "Proceeding to Checkout",
      description: `${toy.title} has been added to your cart and we're redirecting you to checkout.`,
    });
    // In a real application, you would redirect to the checkout page here
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Navigation />
      <main className="flex-1">
        <ToyMarketBanner />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-64 space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building">
                        Building & Construction
                      </SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="pretend">Pretend Play</SelectItem>
                      <SelectItem value="outdoor">Outdoor & Sports</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="arts">Arts & Crafts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-8">6-8 years</SelectItem>
                      <SelectItem value="9-12">9-12 years</SelectItem>
                      <SelectItem value="12+">12+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token Range</label>
                  <Slider
                    value={tokenRange}
                    onValueChange={setTokenRange}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{tokenRange[0]} tokens</span>
                    <span>{tokenRange[1]} tokens</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Toys Grid */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <Input placeholder="Search toys..." className="max-w-md" />
                <Button>Search</Button>
              </div>

              <ToyRecommendations />

              <h2 className="text-2xl font-bold mb-4">All Toys</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toys.map((toy) => (
                  <Card key={toy.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start gap-2">
                        <span>{toy.title}</span>
                        <Badge variant="secondary">{toy.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="relative h-48 mb-4">
                        <Image
                          src={toy.image || "/placeholder.svg"}
                          alt={toy.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {toy.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{toy.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Age: {toy.ageRange}
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        {toy.tokens} tokens
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button onClick={() => handleAddToCart(toy)}>
                        Add to Cart
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleBuyNow(toy)}
                      >
                        Buy Now
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleWishlist(toy.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            wishlist.includes(toy.id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
