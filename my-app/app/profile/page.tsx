"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockUser = {
  name: "Alisher Ibrayev",
  email: "Alisher.Ibrayev@nitec.kz",
  avatar: "/avatars/john-doe.jpg",
  subscription: "Premium",
  tokensRemaining: 75,
  rentedToys: [
    { id: 1, name: "LEGO City Space Set", returnDate: "2023-06-15" },
    { id: 2, name: "Melissa & Doug Wooden Kitchen", returnDate: "2023-06-20" },
  ],
  rentalHistory: [
    { id: 3, name: "VTech KidiZoom Creator Cam", returnDate: "2023-05-30" },
    { id: 4, name: "Magna-Tiles Clear Colors Set", returnDate: "2023-05-25" },
  ],
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const { toast } = useToast();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
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

  const handleExtendRental = (toyId: number) => {
    // In a real application, this would extend the rental period
    toast({
      title: "Rental Extended",
      description: `The rental period for toy #${toyId} has been extended by 7 days.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-16">
        <div className="flex items-center mb-8">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Tabs defaultValue="subscription">
          <TabsList className="mb-8">
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
              <CardContent>
                <p className="mb-4">
                  Current Plan: <strong>{user.subscription}</strong>
                </p>
                <p className="mb-4">
                  Tokens Remaining: <strong>{user.tokensRemaining}</strong>
                </p>
                <Button onClick={handleUpgradePlan}>Upgrade Plan</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Current Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {user.rentedToys.map((toy) => (
                  <div
                    key={toy.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <span>{toy.name}</span>
                    <div>
                      <span className="mr-4">Return by: {toy.returnDate}</span>
                      <Button onClick={() => handleExtendRental(toy.id)}>
                        Extend Rental
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Rental History</CardTitle>
              </CardHeader>
              <CardContent>
                {user.rentalHistory.map((toy) => (
                  <div
                    key={toy.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <span>{toy.name}</span>
                    <span>Returned on: {toy.returnDate}</span>
                  </div>
                ))}
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
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <Button type="submit">Update Profile</Button>
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
