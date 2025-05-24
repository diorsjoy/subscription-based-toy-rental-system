// app/layout.tsx - Fixed version
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { CartProvider } from "@/components/cart";
import { ThemeProvider } from "@/components/theme-provider";
import { TokenProvider } from "@/components/providers/token-provider";
import { RentalProvider } from "@/components/providers/rental-provider";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oiyn Shak - Toy Rental",
  description:
    "Rent high-quality toys for your children with our flexible subscription plans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono">
        {/* Grid background */}
        <div className="fixed inset-0 z-0 pointer-events-none futuristic-grid-bg" />

        <ThemeProvider>
          <CartProvider>
            <TokenProvider>
              <RentalProvider>
                {children}
                <Toaster />
              </RentalProvider>
            </TokenProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
