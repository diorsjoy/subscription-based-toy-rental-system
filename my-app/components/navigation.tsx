"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartButton } from "@/components/cart";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";
export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`
      relative top-0 z-50 w-full 
      backdrop-blur-sm 
      border-b
      ${
        theme === "dark"
          ? "bg-black bg-opacity-80 border-blue-900"
          : "bg-white bg-opacity-80 border-green-300"
      }
      ${glitchActive ? "translate-x-0.5" : ""}
      transition-transform duration-100
    `}
    >
      <div className="container flex h-16 items-center px-8 py-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/bear.svg"
              alt="Oiyn Shak"
              width={32}
              height={32}
              className="rounded-full"
            />

            <span className="hidden font-bold sm:inline-block">Oiyn Shak</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {["BROWSE", "HOW IT WORKS", "PRICING"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                onMouseEnter={() => setHoverItem(item)}
                onMouseLeave={() => setHoverItem(null)}
                className={`
                  relative
                  text-sm font-bold
                  transition-colors duration-300
                  ${
                    hoverItem === item
                      ? theme === "dark"
                        ? "text-blue-400"
                        : "text-violet-600"
                      : theme === "dark"
                      ? "text-white"
                      : "text-violet-800"
                  }
                  hover:${
                    theme === "dark" ? "text-blue-400" : "text-violet-600"
                  }
                `}
              >
                {item}
                {hoverItem === item && (
                  <div
                    className={`absolute -bottom-1 left-0 h-0.5 w-full ${
                      theme === "dark" ? "bg-blue-400" : "bg-violet-600"
                    }`}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={
              theme === "dark"
                ? "bg-black border-blue-900 text-white"
                : "bg-white border-green-300 text-violet-800"
            }
          >
            <nav className="grid gap-6 px-2 py-6">
              <Link
                href="/browse"
                className={`hover:${
                  theme === "dark" ? "text-blue-400" : "text-violet-600"
                }`}
              >
                BROWSE
              </Link>
              <Link
                href="/how-it-works"
                className={`hover:${
                  theme === "dark" ? "text-blue-400" : "text-violet-600"
                }`}
              >
                HOW IT WORKS
              </Link>
              <Link
                href="/pricing"
                className={`hover:${
                  theme === "dark" ? "text-blue-400" : "text-violet-600"
                }`}
              >
                PRICING
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search
                className={`absolute left-2 top-2.5 h-4 w-4 ${
                  theme === "dark" ? "text-blue-400" : "text-violet-400"
                }`}
              />
              <Input
                placeholder="Search toys..."
                className={`pl-8 md:w-[300px] lg:w-[400px] outline-none ${
                  theme === "dark"
                    ? "bg-blue-900 bg-opacity-30 text-white border border-blue-800 focus:border-blue-500"
                    : "bg-violet-100 bg-opacity-60 text-violet-800 border border-violet-200 focus:border-violet-500"
                }`}
              />
            </div>
          </div>
          <ThemeToggle />
          <CartButton />
          <Button
            className={`ml-auto hidden md:flex group relative overflow-hidden ${
              theme === "dark"
                ? "bg-blue-600 text-white border-blue-500 hover:bg-blue-500"
                : "bg-green-500 text-white border-green-400 hover:bg-green-400"
            }`}
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            <User className="mr-2 h-4 w-4" />
            <span className="relative z-10">
              {isLoggedIn ? "MY ACCOUNT" : "LOG IN"}
            </span>
            <div
              className={`absolute inset-0 w-0 transition-all duration-300 group-hover:w-full opacity-20 ${
                theme === "dark" ? "bg-blue-400" : "bg-violet-400"
              }`}
            ></div>

            {/* Button corners */}
            <div
              className={`absolute top-0 left-0 w-2 h-2 ${
                theme === "dark" ? "bg-blue-300" : "bg-green-300"
              }`}
            ></div>
            <div
              className={`absolute top-0 right-0 w-2 h-2 ${
                theme === "dark" ? "bg-blue-300" : "bg-green-300"
              }`}
            ></div>
            <div
              className={`absolute bottom-0 left-0 w-2 h-2 ${
                theme === "dark" ? "bg-blue-300" : "bg-green-300"
              }`}
            ></div>
            <div
              className={`absolute bottom-0 right-0 w-2 h-2 ${
                theme === "dark" ? "bg-blue-300" : "bg-green-300"
              }`}
            ></div>
          </Button>
        </div>
      </div>
    </header>
  );
}
