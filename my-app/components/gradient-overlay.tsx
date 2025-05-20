"use client";

import React from "react";
import { useTheme } from "./theme-provider";

export function GradientOverlay() {
  const { theme } = useTheme();

  const gradientClass =
    theme === "dark"
      ? "bg-gradient-to-r from-black/90 to-transparent"
      : "bg-gradient-to-r from-white/70 to-transparent";

  return <div className={`absolute inset-0 ${gradientClass}`} />;
}
