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
} from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { t, currentLanguage } = useTranslation();

  const navItems = [
    { name: t("nav.browse"), href: "/browse", key: "browse" },
    { name: t("nav.howItWorks"), href: "/how-it-works", key: "howItWorks" },
    { name: t("nav.pricing"), href: "/pricing", key: "pricing" },
  ];

  const userMenuItems = [
    { name: t("nav.profile"), href: "/profile", icon: User, key: "profile" },
    { name: t("nav.rentals"), href: "/rentals", icon: Package, key: "rentals" },
    // {
    //   name: t("nav.wishlist"),
    //   href: "/wishlist",
    //   icon: Heart,
    //   key: "wishlist",
    // },
    { name: t("nav.tokens"), href: "/tokens", icon: Coins, key: "tokens" },
    {
      name: t("nav.settings"),
      href: "/settings",
      icon: Settings,
      key: "settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getMembershipColor = (tier?: string) => {
    switch (tier) {
      case "Premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "VIP":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
  };

  const getMembershipTierTranslation = (tier?: string) => {
    switch (tier) {
      case "Premium":
        return t("membership.premium");
      case "VIP":
        return t("membership.vip");
      default:
        return t("membership.basic");
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
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
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
                        </div>
                      </div>

                      {/* Membership and Token Info */}
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`text-white ${getMembershipColor(
                            user.membershipTier
                          )}`}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {getMembershipTierTranslation(user.membershipTier)}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                          {user.tokensBalance || 0} {t("common.tokens")}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.key} asChild>
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                        {item.key === "tokens" && (
                          <Badge variant="secondary" className="ml-auto">
                            {user.tokensBalance || 0}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}

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
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-semibold">
                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge
                            className={`text-white text-xs ${getMembershipColor(
                              user.membershipTier
                            )}`}
                          >
                            {getMembershipTierTranslation(user.membershipTier)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                            {user.tokensBalance || 0}
                          </div>
                        </div>
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
                              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                              {item.key === "tokens" && (
                                <Badge variant="secondary" className="ml-auto">
                                  {user.tokensBalance || 0}
                                </Badge>
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
