// components/navigation.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartButton } from "@/components/cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import useTranslation from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import Image from "next/image";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Star,
  Coins,
  Package,
  Crown,
  Clock,
  AlertCircle,
  Shield,
} from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading, isAdmin } = useAuth();
  const {
    subscription,
    isSubscribed,
    loading: subscriptionLoading,
  } = useSubscription();
  const { t, currentLanguage } = useTranslation();

  const navItems = [
    { name: t("nav.browse"), href: "/browse", key: "browse" },
    { name: t("nav.howItWorks"), href: "/how-it-works", key: "howItWorks" },
    { name: t("nav.pricing"), href: "/pricing", key: "pricing" },
  ];

  const userMenuItems = [
    { name: t("nav.profile"), href: "/profile", icon: User, key: "profile" },
    { name: t("nav.rentals"), href: "/rentals", icon: Package, key: "rentals" },
    { name: t("nav.tokens"), href: "/tokens", icon: Coins, key: "tokens" },
    ...(isAdmin()
      ? [{ name: "Admin Panel", href: "/admin", icon: Shield, key: "admin" }]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get subscription-based membership info
  const getSubscriptionInfo = () => {
    if (!isAuthenticated || subscriptionLoading) {
      return {
        tier: "Free",
        color: "bg-gradient-to-r from-gray-400 to-gray-500",
        icon: User,
        tokens: 0,
        status: "loading",
      };
    }

    if (!isSubscribed || !subscription) {
      return {
        tier: "Free",
        color: "bg-gradient-to-r from-gray-400 to-gray-500",
        icon: User,
        tokens: 0,
        status: "free",
      };
    }

    // Map plan names to display info
    const planName = subscription.plan_name.toLowerCase();
    if (planName.includes("premium") || planName.includes("ultimate")) {
      return {
        tier: subscription.plan_name,
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        icon: Crown,
        tokens: subscription.remaining_limit,
        status: "premium",
      };
    } else if (planName.includes("family")) {
      return {
        tier: subscription.plan_name,
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        icon: Star,
        tokens: subscription.remaining_limit,
        status: "family",
      };
    } else {
      return {
        tier: subscription.plan_name,
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        icon: Package,
        tokens: subscription.remaining_limit,
        status: "basic",
      };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();

  // Format expiry date
  const getExpiryInfo = () => {
    if (!subscription) return null;

    const expiryDate = new Date(subscription.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      date: expiryDate.toLocaleDateString(),
      daysLeft: daysUntilExpiry,
      isExpiringSoon: daysUntilExpiry <= 7,
    };
  };

  const expiryInfo = getExpiryInfo();

  const getMembershipTierTranslation = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "premium":
        return t("membership.premium");
      case "family":
        return t("membership.family");
      case "basic":
        return t("membership.basic");
      case "free":
        return t("membership.free");
      default:
        return tier;
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/bear.svg"
                alt="Oiyn Shak"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="hidden font-bold sm:inline-block">
                Oiyn Shak
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart */}
            {isAuthenticated && <CartButton />}

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-semibold">
                      {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-sm font-semibold">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : "User Name"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {user.email}
                          </p>
                          {isAdmin() && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Subscription Status */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-white ${subscriptionInfo.color}`}
                          >
                            <subscriptionInfo.icon className="w-3 h-3 mr-1" />
                            {getMembershipTierTranslation(
                              subscriptionInfo.tier
                            )}
                          </Badge>
                          {subscriptionLoading ? (
                            <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <div className="flex items-center text-sm text-gray-600">
                              <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                              {subscriptionInfo.tokens}{" "}
                              {isSubscribed ? "rentals" : "tokens"}
                            </div>
                          )}
                        </div>

                        {/* Subscription Details */}

                        {/* No subscription message */}
                        {!isSubscribed && !subscriptionLoading && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            <p className="text-xs text-yellow-800">
                              No active subscription.
                              <Link href="/pricing" className="underline ml-1">
                                Choose a plan
                              </Link>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.key} asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center ${
                          item.key === "admin"
                            ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            : ""
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                        {item.key === "tokens" && (
                          <Badge variant="secondary" className="ml-auto">
                            {subscriptionInfo.tokens}
                          </Badge>
                        )}
                        {item.key === "admin" && (
                          <Crown className="w-3 h-3 ml-auto text-purple-500" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* Quick Actions */}
                  {isSubscribed ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile?tab=manage"
                        className="flex items-center text-blue-600"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Manage Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/pricing"
                        className="flex items-center text-green-600"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span>Subscribe Now</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("auth.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="ghost">{t("auth.login")}</Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* User info in mobile */}
                  {isAuthenticated && user && (
                    <div className="flex flex-col space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-semibold">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      {/* Mobile Subscription Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-white text-xs ${subscriptionInfo.color}`}
                          >
                            <subscriptionInfo.icon className="w-3 h-3 mr-1" />
                            {getMembershipTierTranslation(
                              subscriptionInfo.tier
                            )}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                            {subscriptionInfo.tokens}
                          </div>
                        </div>

                        {isSubscribed && subscription && expiryInfo && (
                          <div className="text-xs text-gray-500">
                            <div className="flex justify-between">
                              <span>Expires: {expiryInfo.date}</span>
                              {expiryInfo.isExpiringSoon && (
                                <span className="text-red-600">
                                  {expiryInfo.daysLeft} days left
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {!isSubscribed && !subscriptionLoading && (
                          <Link
                            href="/pricing"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button size="sm" className="w-full">
                              Subscribe Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation items */}
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* User menu items (mobile) */}
                  {isAuthenticated && user && (
                    <>
                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.key}
                              href={item.href}
                              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                item.key === "admin"
                                  ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                              {item.key === "tokens" && (
                                <Badge variant="secondary" className="ml-auto">
                                  {subscriptionInfo.tokens}
                                </Badge>
                              )}
                              {item.key === "admin" && (
                                <Crown className="w-4 h-4 ml-auto text-purple-500" />
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          {t("auth.logout")}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Auth buttons (mobile) */}
                  {!isAuthenticated && (
                    <div className="space-y-2 border-t pt-4">
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          {t("auth.login")}
                        </Button>
                      </Link>
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          {t("nav.getStarted")}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Language selector in mobile */}
                  <div className="border-t pt-4">
                    <div className="px-3 py-2">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
