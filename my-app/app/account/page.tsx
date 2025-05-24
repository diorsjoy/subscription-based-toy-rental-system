// app/account/page.tsx
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Package,
  History,
  Coins,
  Calendar,
  MapPin,
  Bell,
  Shield,
  CreditCard,
  Star,
  Clock,
  TrendingUp,
  Gift,
  Award,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Heart,
  Download,
  Mail,
  Phone,
  Camera,
} from "lucide-react";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

interface RentalItem {
  id: number;
  toyName: string;
  image: string;
  startDate: string;
  endDate: string;
  status: "active" | "returned" | "overdue" | "extending";
  tokens: number;
  rating?: number;
}

interface TokenTransaction {
  id: string;
  type: "purchase" | "rental" | "refund" | "bonus";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

const mockUser = {
  id: "1",
  name: "Alisher Ibrayev",
  email: "Alisher.Ibrayev@nitec.kz",
  phone: "+7 (701) 234-5678",
  avatar: "/avatars/alisher.jpg",
  memberSince: "2023-01-15",
  subscription: {
    plan: "Premium",
    status: "active",
    renewalDate: "2024-07-15",
    tokensIncluded: 100,
    features: ["Priority Support", "Free Delivery", "Early Access"],
  },
  tokenBalance: 75,
  totalTokensEarned: 450,
  toysRented: 23,
  favoriteCategory: "Educational",
  membershipLevel: "Gold",
  points: 1250,
};

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    street: "123 Satpayev Street, Apt 4B",
    city: "Almaty",
    zipCode: "050000",
    isDefault: true,
  },
  {
    id: "2",
    label: "Work",
    street: "456 Republic Avenue, Office 12",
    city: "Astana",
    zipCode: "010000",
    isDefault: false,
  },
];

const mockCurrentRentals: RentalItem[] = [
  {
    id: 1,
    toyName: "LEGO Architecture Burj Khalifa",
    image: "/placeholder.svg?height=100&width=100",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    status: "active",
    tokens: 85,
  },
  {
    id: 2,
    toyName: "National Geographic Break Open Geodes Kit",
    image: "/placeholder.svg?height=100&width=100",
    startDate: "2024-05-28",
    endDate: "2024-06-12",
    status: "extending",
    tokens: 55,
  },
];

const mockRentalHistory: RentalItem[] = [
  {
    id: 3,
    toyName: "Melissa & Doug Deluxe Kitchen Set",
    image: "/placeholder.svg?height=100&width=100",
    startDate: "2024-05-01",
    endDate: "2024-05-15",
    status: "returned",
    tokens: 75,
    rating: 5,
  },
  {
    id: 4,
    toyName: "VTech KidiBeats Kids Drum Set",
    image: "/placeholder.svg?height=100&width=100",
    startDate: "2024-04-15",
    endDate: "2024-04-29",
    status: "returned",
    tokens: 65,
    rating: 4,
  },
];

const mockTokenTransactions: TokenTransaction[] = [
  {
    id: "t1",
    type: "purchase",
    amount: 100,
    description: "Token Package Purchase - Family Pack",
    date: "2024-06-01",
    status: "completed",
  },
  {
    id: "t2",
    type: "rental",
    amount: -85,
    description: "LEGO Architecture Burj Khalifa Rental",
    date: "2024-06-01",
    status: "completed",
  },
  {
    id: "t3",
    type: "bonus",
    amount: 20,
    description: "Referral Bonus - Friend Signup",
    date: "2024-05-28",
    status: "completed",
  },
  {
    id: "t4",
    type: "rental",
    amount: -55,
    description: "Geodes Kit Rental",
    date: "2024-05-28",
    status: "completed",
  },
  {
    id: "t5",
    type: "refund",
    amount: 25,
    description: "Early Return Credit",
    date: "2024-05-20",
    status: "completed",
  },
];

export default function EnhancedAccountPage() {
  const [user, setUser] = useState(mockUser);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile Updated Successfully! ✅",
      description: "Your profile information has been saved.",
    });
  };

  const handleExtendRental = (rentalId: number) => {
    toast({
      title: "Rental Extended! ⏰",
      description: "Your rental period has been extended by 7 days.",
    });
  };

  const handleAddAddress = () => {
    // This would open an address form modal
    toast({
      title: "Add New Address",
      description: "Address form would open here.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "extending":
        return "bg-blue-100 text-blue-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "returned":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "rental":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "refund":
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case "bonus":
        return <Gift className="w-4 h-4 text-yellow-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600" />;
    }
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
              className="flex items-center gap-6"
            >
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    {user.membershipLevel}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(user.memberSince).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.tokenBalance}
                  </div>
                  <div className="text-sm text-gray-600">Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {user.toysRented}
                  </div>
                  <div className="text-sm text-gray-600">Toys Rented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.points}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="rentals" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Rentals</span>
              </TabsTrigger>
              <TabsTrigger value="tokens" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Tokens</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Token Balance Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Token Balance
                    </CardTitle>
                    <Coins className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {user.tokenBalance}
                    </div>
                    <p className="text-xs text-blue-600/80 mt-1">
                      +20 this month
                    </p>
                    <Button size="sm" className="mt-3 w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Buy Tokens
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Rentals Card */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Rentals
                    </CardTitle>
                    <Package className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {mockCurrentRentals.length}
                    </div>
                    <p className="text-xs text-green-600/80 mt-1">
                      2 toys currently rented
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View All
                    </Button>
                  </CardContent>
                </Card>

                {/* Total Toys Rented */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Toys Rented
                    </CardTitle>
                    <History className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {user.toysRented}
                    </div>
                    <p className="text-xs text-purple-600/80 mt-1">
                      +3 this month
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Browse More
                    </Button>
                  </CardContent>
                </Card>

                {/* Membership Points */}
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Loyalty Points
                    </CardTitle>
                    <Award className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">
                      {user.points}
                    </div>
                    <p className="text-xs text-yellow-600/80 mt-1">
                      250 pts to next reward
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Current Rentals Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Rentals</span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCurrentRentals.map((rental) => (
                      <div
                        key={rental.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={rental.image}
                          alt={rental.toyName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{rental.toyName}</h4>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(rental.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(rental.status)}>
                          {rental.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExtendRental(rental.id)}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Extend
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rentals Tab */}
            <TabsContent value="rentals" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Rentals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Current Rentals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCurrentRentals.map((rental) => (
                        <div
                          key={rental.id}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={rental.image}
                              alt={rental.toyName}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{rental.toyName}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Started:{" "}
                                {new Date(
                                  rental.startDate
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Due:{" "}
                                {new Date(rental.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  className={getStatusColor(rental.status)}
                                >
                                  {rental.status}
                                </Badge>
                                <span className="text-sm font-medium text-blue-600">
                                  {rental.tokens} tokens
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Extend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Package className="w-4 h-4 mr-1" />
                              Return
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Rental History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2" />
                      Rental History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRentalHistory.map((rental) => (
                        <div key={rental.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <img
                              src={rental.image}
                              alt={rental.toyName}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{rental.toyName}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  rental.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(rental.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  className={getStatusColor(rental.status)}
                                >
                                  {rental.status}
                                </Badge>
                                {rental.rating && (
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < rental.rating!
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                                <span className="text-sm text-gray-600">
                                  {rental.tokens} tokens
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tokens Tab */}
            <TabsContent value="tokens" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Token Balance Overview */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="w-5 h-5 mr-2" />
                      Token Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {user.tokenBalance}
                      </div>
                      <p className="text-gray-600">Available Tokens</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Earned:</span>
                        <span className="font-medium">
                          {user.totalTokensEarned}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">This Month:</span>
                        <span className="font-medium text-green-600">+45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent Total:</span>
                        <span className="font-medium">
                          {user.totalTokensEarned - user.tokenBalance}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Buy More Tokens
                    </Button>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <History className="w-5 h-5 mr-2" />
                        Transaction History
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockTokenTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-bold ${
                                transaction.amount > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount}
                            </div>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Your Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {user.subscription.plan} Plan
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Renews on{" "}
                        {new Date(
                          user.subscription.renewalDate
                        ).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-700">
                          {user.subscription.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {user.subscription.tokensIncluded} tokens/month
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button>Manage Plan</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {user.subscription.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <Star className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Pause Subscription
                    </Button>
                    <Button variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Delivery Addresses
                    </span>
                    <Button onClick={handleAddAddress}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{address.label}</h4>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.street}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.zipCode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Profile Information
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          defaultValue={user.name}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          defaultValue={user.phone}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="memberSince">Member Since</Label>
                        <Input
                          id="memberSince"
                          defaultValue={new Date(
                            user.memberSince
                          ).toLocaleDateString()}
                          disabled
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <Button type="submit" className="w-full md:w-auto">
                        Save Changes
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: "email",
                      label: "Email Notifications",
                      icon: <Mail className="w-4 h-4" />,
                    },
                    {
                      id: "sms",
                      label: "SMS Notifications",
                      icon: <Phone className="w-4 h-4" />,
                    },
                    {
                      id: "rental",
                      label: "Rental Reminders",
                      icon: <Clock className="w-4 h-4" />,
                    },
                    {
                      id: "marketing",
                      label: "Marketing Updates",
                      icon: <Gift className="w-4 h-4" />,
                    },
                  ].map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {setting.icon}
                        <span>{setting.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
