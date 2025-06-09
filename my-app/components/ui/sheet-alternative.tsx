"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps {
  className?: string;
  children: React.ReactNode;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  children: React.ReactNode;
}

// Context for Sheet state
const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet");
  }
  return context;
};

// Main Sheet component
export function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
}: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

// Sheet Trigger
export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return <button onClick={() => setOpen(true)}>{children}</button>;
}

// Sheet Content
export function SheetContent({ className = "", children }: SheetContentProps) {
  const { open, setOpen } = useSheet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  const content = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Sheet */}
      <div
        className={`absolute right-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${className} w-[400px] sm:w-[540px]`}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 p-2"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

// Sheet Header
export function SheetHeader({ children }: SheetHeaderProps) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

// Sheet Title
export function SheetTitle({ children }: SheetTitleProps) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
