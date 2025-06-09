// components/CustomImage.tsx - Custom image component for external URLs
"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
}

export const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  width,
  height,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // If image failed to load or no src provided
  if (imageError || !src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${
          fallbackClassName || className
        }`}
      >
        <Camera className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}
        >
          <div className="animate-pulse w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        width={width}
        height={height}
        style={imageLoading ? { opacity: 0 } : { opacity: 1 }}
      />
    </div>
  );
};

// Alternative: Next.js config fix (create this file: next.config.js)
export const nextConfigFix = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP domains (for development)
      },
    ],
    // Alternative: specific domains
    domains: [
      's7.orientaltrading.com',
      'via.placeholder.com',
      'images.unsplash.com',
      'example.com',
      // Add more domains as needed
    ],
  },
}

module.exports = nextConfig
`;

// Hook for handling image URLs
export const useImageUrl = (url: string | undefined) => {
  if (!url) return null;

  // Handle relative URLs
  if (url.startsWith("/")) {
    return url;
  }

  // Handle full URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Handle blob URLs (for uploaded files)
  if (url.startsWith("blob:")) {
    return url;
  }

  // Default fallback
  return url;
};

// Enhanced image component with better error handling
export const ToyImage: React.FC<{
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, className = "", width, height }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageUrl = useImageUrl(src);

  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <Camera className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}
        >
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        width={width}
        height={height}
      />
    </>
  );
};
