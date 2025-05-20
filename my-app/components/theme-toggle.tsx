"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-violet-600" />
      )}
      <span className="sr-only">Toggle theme</span>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current"></div>
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current"></div>
    </Button>
  );
}
