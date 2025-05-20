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
import { SubscriptionProgress } from "@/components/subscription-progress";

const mockUser = {
  name: "Alisher Ibrayev",
  email: "Alisher.Ibrayev@nitec.kz",
  avatar: "/avatars/john-doe.jpg",
  subscription: "Premium",
  tokensRemaining: 75,
  totalTokens: 100,
  daysLeft: 22,
  rentedToys: [
    { id: 1, name: "LEGO City Space Set", returnDate: "2023-06-15" },
    { id: 2, name: "Melissa & Doug Wooden Kitchen", returnDate: "2023-06-20" },
  ],
};

export default function AccountPage() {
  const [user, setUser] = useState(mockUser);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Profile updated");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Current Plan: <strong>{user.subscription}</strong>
                  </p>
                  <SubscriptionProgress
                    totalTokens={user.totalTokens}
                    usedTokens={user.totalTokens - user.tokensRemaining}
                    daysLeft={user.daysLeft}
                  />
                  <Button className="mt-4">Upgrade Plan</Button>
                </CardContent>
              </Card>
            </div>
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
                    <span>Return by: {toy.returnDate}</span>
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
