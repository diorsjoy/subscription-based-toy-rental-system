// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { bucketService } from "@/services/bucketService";
import {
  Calendar,
  Clock,
  CreditCard,
  Package,
  Settings,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Trash2,
  Crown,
  Star,
  ArrowRight,
} from "lucide-react";

// Types
interface BucketToy {
  toy_id: number;
  name: string;
  value: number;
  image_url: string;
  quantity: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

// Main component - make sure this is the default export
function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading, updateUser } = useAuth();
  const { toast } = useToast();
  const {
    subscription,
    plans,
    loading: subscriptionLoading,
    error: subscriptionError,
    isSubscribed,
    subscribe,
    changePlan,
    unsubscribe,
    refreshSubscription,
  } = useSubscription();

  // State management
  const [bucketContents, setBucketContents] = useState<BucketToy[]>([]);
  const [loading, setLoading] = useState({
    bucket: true,
    profile: false,
    planAction: false,
  });
  const [activeTab, setActiveTab] = useState("subscription");

  // Form data
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user]);

  // Load bucket data
  useEffect(() => {
    if (isAuthenticated) {
      loadBucketData();
    }
  }, [isAuthenticated]);

  const loadBucketData = async () => {
    try {
      setLoading((prev) => ({ ...prev, bucket: true }));
      const bucketData = await bucketService.getBucket();
      setBucketContents(bucketData.toys);
    } catch (error) {
      console.error("Error loading bucket data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, bucket: false }));
    }
  };

  const handleSubscriptionAction = async (
    planId: number,
    actionType: "subscribe" | "change"
  ) => {
    try {
      setLoading((prev) => ({ ...prev, planAction: true }));

      let success = false;
      if (actionType === "subscribe") {
        success = await subscribe(planId);
      } else {
        success = await changePlan(planId);
      }

      if (success) {
        toast({
          title:
            actionType === "subscribe"
              ? "Subscription Created"
              : "Plan Changed",
          description:
            actionType === "subscribe"
              ? "Welcome to Oiyn Shak! Your subscription is now active."
              : "Your plan has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, planAction: false }));
    }
  };

  const handleUnsubscribe = async () => {
    if (
      !confirm(
        "Are you sure you want to unsubscribe? This will cancel your current plan."
      )
    ) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, planAction: true }));
      const success = await unsubscribe();

      if (success) {
        toast({
          title: "Unsubscribed",
          description: "Your subscription has been cancelled successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Unsubscribe Failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, planAction: false }));
    }
  };

  const handleRemoveFromBucket = async (toyId: number) => {
    try {
      await bucketService.removeFromBucket([toyId]);
      await loadBucketData();
      toast({
        title: "Item Removed",
        description: "Item removed from your bucket",
      });
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove item from bucket",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, profile: true }));

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
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const formatDuration = (duration: string): string => {
    const numericDuration = parseInt(duration);
    switch (numericDuration) {
      case 1:
        return "1 month";
      case 3:
        return "3 months";
      case 6:
        return "6 months";
      case 12:
        return "1 year";
      default:
        return `${duration} months`;
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  const getTotalBucketValue = () => {
    return bucketContents.reduce(
      (sum, toy) => sum + toy.value * toy.quantity,
      0
    );
  };

  const getPlanBadge = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("premium") || name.includes("ultimate")) {
      return <Crown className="w-4 h-4 text-purple-600" />;
    }
    if (name.includes("family")) {
      return <Star className="w-4 h-4 text-blue-600" />;
    }
    return null;
  };

  // Loading state
  if (isLoading || subscriptionLoading) {
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

  // Authentication check
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{getUserDisplayName()}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {isSubscribed && subscription && (
              <div className="flex items-center gap-2 mt-2">
                {getPlanBadge(subscription.plan_name)}
                <Badge variant="secondary">
                  {subscription.plan_name} Member
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={refreshSubscription}
              disabled={subscriptionLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  subscriptionLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {subscriptionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{subscriptionError}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="subscription"
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="bucket" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Bucket
              {bucketContents.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {bucketContents.reduce((sum, toy) => sum + toy.quantity, 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Subscription
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Rentals
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Your Subscription
                  {subscriptionLoading && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubscribed && subscription ? (
                  <>
                    {/* Subscription Status */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Active Subscription:</strong>{" "}
                        {subscription.plan_name}
                      </AlertDescription>
                    </Alert>

                    {/* Subscription Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg">Current Plan</h3>
                        <div className="flex items-center gap-2">
                          {getPlanBadge(subscription.plan_name)}
                          <p className="text-2xl font-bold text-blue-600">
                            {subscription.plan_name}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg">
                          Rentals Remaining
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                          {subscription.remaining_limit}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg">Expires On</h3>
                        <p className="text-lg font-bold text-purple-600">
                          {new Date(
                            subscription.expires_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setActiveTab("manage")}
                        className="flex-1"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Subscription
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/browse")}
                        className="flex-1"
                      >
                        Browse Toys
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You don't have an active subscription. Choose a plan to
                        start renting toys!
                      </AlertDescription>
                    </Alert>

                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/pricing")}
                      >
                        View All Plans
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bucket Tab */}
          <TabsContent value="bucket">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Bucket
                  {loading.bucket && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.bucket ? (
                  <div className="text-center py-8">Loading bucket...</div>
                ) : bucketContents.length > 0 ? (
                  <div className="space-y-4">
                    {bucketContents.map((toy) => (
                      <div
                        key={toy.toy_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={toy.image_url || "/api/placeholder/64/64"}
                            alt={toy.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{toy.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {toy.quantity} • Value:{" "}
                              {toy.value * toy.quantity} tokens
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFromBucket(toy.toy_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg">
                          Total Cost: {getTotalBucketValue()} tokens
                        </span>
                        <Badge variant="outline">
                          {bucketContents.reduce(
                            (sum, toy) => sum + toy.quantity,
                            0
                          )}{" "}
                          items
                        </Badge>
                      </div>

                      {subscription &&
                      subscription.remaining_limit >= getTotalBucketValue() ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Proceed to Rental
                        </Button>
                      ) : (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {!subscription
                              ? "You need an active subscription to rent toys."
                              : `Insufficient tokens. You need ${
                                  getTotalBucketValue() -
                                  subscription.remaining_limit
                                } more tokens.`}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Your bucket is empty
                    </p>
                    <Button onClick={() => (window.location.href = "/browse")}>
                      Browse Toys
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Subscription Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Manage Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubscribed && subscription ? (
                  <>
                    {/* Current Plan Info */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Current Plan:</strong> {subscription.plan_name}{" "}
                        •<strong> Rentals:</strong>{" "}
                        {subscription.remaining_limit} •
                        <strong> Expires:</strong>{" "}
                        {new Date(subscription.expires_at).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>

                    {/* Change Plan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Change Your Plan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plans
                          .filter((plan) => plan.planId !== subscription.planId)
                          .map((plan) => (
                            <Card key={plan.planId} className="border-2">
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {plan.name
                                    .toLowerCase()
                                    .includes("premium") && (
                                    <Crown className="w-4 h-4 text-purple-600" />
                                  )}
                                  {plan.name
                                    .toLowerCase()
                                    .includes("family") && (
                                    <Star className="w-4 h-4 text-blue-600" />
                                  )}
                                  {plan.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 mb-4">
                                  <p>
                                    <strong>Price:</strong> ₸
                                    {plan.price.toLocaleString()}
                                  </p>
                                  <p>
                                    <strong>Rental Limit:</strong>{" "}
                                    {plan.rental_limit} toys
                                  </p>
                                  <p>
                                    <strong>Duration:</strong>{" "}
                                    {formatDuration(plan.duration)}
                                  </p>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleSubscriptionAction(
                                      plan.planId,
                                      "change"
                                    )
                                  }
                                  className="w-full"
                                  variant="outline"
                                  disabled={loading.planAction}
                                >
                                  {loading.planAction ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  ) : null}
                                  Change to This Plan
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-red-600">
                        Danger Zone
                      </h3>
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Unsubscribing will cancel your current plan and you'll
                          lose access to rental features.
                        </AlertDescription>
                      </Alert>
                      <Button
                        variant="destructive"
                        onClick={handleUnsubscribe}
                        disabled={loading.planAction}
                      >
                        {loading.planAction ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Unsubscribe
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You don't have an active subscription to manage. Go to the
                      Subscription tab to choose a plan.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rentals Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  My Rentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No active rentals
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rental tracking will be displayed here once you start
                    renting toys.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
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
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={loading.profile}
                  >
                    {loading.profile ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
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

export default ProfilePage;
