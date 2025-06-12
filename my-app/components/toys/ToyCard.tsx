// components/toys/ToyCard.tsx - Clean version
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";
import { useBucket } from "@/hooks/useBucket";
import Image from "next/image";

interface Toy {
  id: number;
  name: string;
  description: string;
  category: string;
  age_range: string;
  token_cost: number;
  is_available: boolean;
  rating?: number;
  image_url: string;
  manufacturer?: string;
}

interface ToyCardProps {
  toy: Toy;
  token: string;
  onAddSuccess?: () => void;
}

export const ToyCard: React.FC<ToyCardProps> = ({
  toy,
  token,
  onAddSuccess,
}) => {
  const { addToBucket } = useBucket(token);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToBucket = async () => {
    if (!toy.is_available) return;

    setIsAdding(true);
    try {
      await addToBucket([
        {
          toy_id: toy_id,
          quantity: quantity,
        },
      ]);
      onAddSuccess?.();
    } catch (error) {
      console.error("Failed to add to bucket:", error);
      // You might want to show a toast notification here
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="relative aspect-square">
        <Image
          src={toy.image_url || "/api/placeholder/300/300"}
          alt={toy.name}
          fill
          className="object-cover"
        />
        {!toy.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
        {toy.rating && (
          <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{toy.rating}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold line-clamp-2 text-sm">{toy.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {toy.description}
            </p>
          </div>

          <div className="flex justify-between items-center text-xs">
            <Badge variant="outline">{toy.category}</Badge>
            <span className="text-gray-500">{toy.age_range}</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-green-600">
                {toy.token_cost} tokens
              </p>
              {toy.manufacturer && (
                <p className="text-xs text-gray-500">{toy.manufacturer}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <span className="px-2 text-sm min-w-[24px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>

            <Button
              onClick={handleAddToBucket}
              disabled={isAdding || !toy.is_available}
              className="flex-1 h-8 text-xs"
            >
              <Plus size={14} className="mr-1" />
              {isAdding ? "Adding..." : "Add to Bucket"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
