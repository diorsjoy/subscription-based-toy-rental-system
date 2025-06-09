"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";

// Mock data for rentals (this would come from your rental API in a real app)
const mockRentals = {
  current: [
    { id: 1, name: "LEGO City Space Set", returnDate: "2024-06-15" },
    { id: 2, name: "Melissa & Doug Wooden Kitchen", returnDate: "2024-06-20" },
  ],
  history: [
    { id: 3, name: "VTech KidiZoom Creator Cam", returnDate: "2024-05-30" },
    { id: 4, name: "Magna-Tiles Clear Colors Set", returnDate: "2024-05-25" },
  ],
};

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading, updateUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Update the user context with new data
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
    });

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleUpgradePlan = () => {
    // In a real application, this would redirect to a plan selection page
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to plan selection...",
    });
  };

  const handleExtendRental = async (toyId: number, toyName: string) => {
    try {
      // In a real application, this would extend the rental period via API
      // await extendRentalAPI(toyId);

      toast({
        title: "Rental Extended",
        description: `The rental period for "${toyName}" has been extended by 7 days.`,
      });
    } catch (error) {
      toast({
        title: "Extension Failed",
        description: "Unable to extend rental. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  const getMembershipDisplay = () => {
    return user?.membershipTier || "Basic";
  };

  const getTokensBalance = () => {
    return user?.tokensBalance || 0;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 container py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 container py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              Please log in to view your profile.
            </p>
            <Button onClick={() => (window.location.href = "/auth")}>
              Go to Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{getUserDisplayName()}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="rentals">Current Rentals</TabsTrigger>
            <TabsTrigger value="history">Rental History</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Current Plan</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {getMembershipDisplay()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Tokens Remaining</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {getTokensBalance()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Total Rentals</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {user.totalRentals || 0}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={handleUpgradePlan}
                    className="w-full md:w-auto"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Current Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {mockRentals.current.length > 0 ? (
                  <div className="space-y-4">
                    {mockRentals.current.map((toy) => (
                      <div
                        key={toy.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg gap-4"
                      >
                        <div>
                          <h3 className="font-semibold">{toy.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Return by:{" "}
                            {new Date(toy.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleExtendRental(toy.id, toy.name)}
                          variant="outline"
                          size="sm"
                        >
                          Extend Rental
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No current rentals</p>
                    <Button
                      onClick={() => (window.location.href = "/catalog")}
                      className="mt-4"
                    >
                      Browse Toys
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Rental History</CardTitle>
              </CardHeader>
              <CardContent>
                {mockRentals.history.length > 0 ? (
                  <div className="space-y-4">
                    {mockRentals.history.map((toy) => (
                      <div
                        key={toy.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <h3 className="font-semibold">{toy.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Returned on:{" "}
                          {new Date(toy.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No rental history yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
