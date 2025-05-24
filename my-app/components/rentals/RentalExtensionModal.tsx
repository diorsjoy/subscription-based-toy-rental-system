"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { useRentals } from "@/components/providers/rental-provider";
import { useTokens } from "@/components/providers/token-provider";

interface RentalExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rental: {
    id: string;
    toyName: string;
    endDate: string;
    tokens: number;
  } | null;
}

export function RentalExtensionModal({
  isOpen,
  onClose,
  rental,
}: RentalExtensionModalProps) {
  const [extensionDays, setExtensionDays] = useState(7);
  const [isExtending, setIsExtending] = useState(false);
  const { extendRental } = useRentals();
  const { tokens } = useTokens();

  if (!rental) return null;

  const calculateExtensionCost = (days: number) => {
    return Math.round((rental.tokens / 14) * days * 0.9);
  };

  const extensionCost = calculateExtensionCost(extensionDays);
  const newEndDate = new Date(rental.endDate);
  newEndDate.setDate(newEndDate.getDate() + extensionDays);

  const handleExtension = async () => {
    if (tokens < extensionCost) {
      return;
    }

    setIsExtending(true);
    const success = await extendRental(rental.id, extensionDays);

    if (success) {
      onClose();
      setExtensionDays(7);
    }
    setIsExtending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extend Rental Period</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{rental.toyName}</h4>
            <p className="text-sm text-muted-foreground">
              Current end date: {new Date(rental.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extension-days">Extension Period (days)</Label>
            <Input
              id="extension-days"
              type="number"
              min="1"
              max="30"
              value={extensionDays}
              onChange={(e) => setExtensionDays(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>New end date: {newEndDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4" />
              <span>Extension cost: {extensionCost} tokens</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Your balance: {tokens} tokens</span>
            </div>
          </div>

          {tokens < extensionCost && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              Insufficient tokens. You need {extensionCost - tokens} more
              tokens.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExtension}
            disabled={isExtending || tokens < extensionCost}
          >
            {isExtending
              ? "Extending..."
              : `Extend for ${extensionCost} tokens`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
