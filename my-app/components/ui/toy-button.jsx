// components/ui/toy-button.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg border-b-4 border-primary-foreground/20 hover:-translate-y-1 hover:shadow-xl hover:border-b-2 active:translate-y-1 active:shadow-md active:border-b-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg border-b-4 border-destructive-foreground/20 hover:-translate-y-1 hover:shadow-xl hover:border-b-2 active:translate-y-1 active:shadow-md active:border-b-0",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:-translate-y-1",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg border-b-4 border-secondary-foreground/20 hover:-translate-y-1 hover:shadow-xl hover:border-b-2 active:translate-y-1 active:shadow-md active:border-b-0",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        bubble:
          "bg-bubble-pink text-white shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95",
        crayon:
          "bg-crayon-yellow text-foreground font-bold shadow-lg transform transition-all duration-200 border-b-4 border-crayon-orange hover:-translate-y-1 active:translate-y-1",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-full px-4",
        lg: "h-14 rounded-full px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ToyButton = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ToyButton.displayName = "ToyButton";

export { ToyButton, buttonVariants };

// components/ui/toy-card.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const ToyCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-3xl border-4 border-primary/20 shadow-xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-toy-hover",
      className
    )}
    {...props}
  />
));
ToyCard.displayName = "ToyCard";

const ToyCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
ToyCardHeader.displayName = "ToyCardHeader";

const ToyCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold text-primary leading-none tracking-wide",
      className
    )}
    {...props}
  />
));
ToyCardTitle.displayName = "ToyCardTitle";

const ToyCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ToyCardDescription.displayName = "ToyCardDescription";

const ToyCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
ToyCardContent.displayName = "ToyCardContent";

const ToyCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
ToyCardFooter.displayName = "ToyCardFooter";

export {
  ToyCard,
  ToyCardHeader,
  ToyCardTitle,
  ToyCardDescription,
  ToyCardContent,
  ToyCardFooter,
};

// components/ui/toy-badge.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary/20 text-secondary-foreground hover:bg-secondary/30",
        accent: "bg-accent/20 text-accent-foreground hover:bg-accent/30",
        outline: "border-2 border-primary text-primary",
        bubble: {
          blue: "bg-bubble-blue/20 text-bubble-blue border border-bubble-blue/50",
          pink: "bg-bubble-pink/20 text-bubble-pink border border-bubble-pink/50",
          green:
            "bg-bubble-green/20 text-bubble-green border border-bubble-green/50",
          yellow:
            "bg-bubble-yellow/20 text-bubble-yellow border border-bubble-yellow/50",
          purple:
            "bg-bubble-purple/20 text-bubble-purple border border-bubble-purple/50",
        },
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ToyBadge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
));
ToyBadge.displayName = "ToyBadge";

export { ToyBadge, badgeVariants };

// components/ui/toy-navbar.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const ToyNavbar = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "bg-background/80 backdrop-blur-md rounded-full shadow-md px-6 py-3 flex items-center justify-between",
      className
    )}
    {...props}
  />
));
ToyNavbar.displayName = "ToyNavbar";

const ToyNavItem = React.forwardRef(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "px-4 py-2 rounded-full font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary",
      active && "bg-primary text-white",
      className
    )}
    {...props}
  />
));
ToyNavItem.displayName = "ToyNavItem";

export { ToyNavbar, ToyNavItem };

// Sample usage component
import { ToyButton } from "@/components/ui/toy-button";
import {
  ToyCard,
  ToyCardHeader,
  ToyCardTitle,
  ToyCardDescription,
  ToyCardContent,
  ToyCardFooter,
} from "@/components/ui/toy-card";
import { ToyBadge } from "@/components/ui/toy-badge";
import { ToyNavbar, ToyNavItem } from "@/components/ui/toy-navbar";

export function ToyThemeShowcase() {
  return (
    <div className="toy-pattern-bg p-8 space-y-8">
      <ToyNavbar>
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">ToyWorld</span>
        </div>
        <div className="flex items-center space-x-2">
          <ToyNavItem href="#" active>
            Home
          </ToyNavItem>
          <ToyNavItem href="#">Toys</ToyNavItem>
          <ToyNavItem href="#">About</ToyNavItem>
          <ToyNavItem href="#">Contact</ToyNavItem>
        </div>
      </ToyNavbar>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ToyCard>
          <ToyCardHeader>
            <ToyCardTitle>Toy Cars Collection</ToyCardTitle>
            <ToyCardDescription>
              Explore our new range of toy cars!
            </ToyCardDescription>
          </ToyCardHeader>
          <ToyCardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <ToyBadge variant="default">New Arrival</ToyBadge>
              <ToyBadge variant="secondary">Ages 3+</ToyBadge>
              <ToyBadge variant="bubble.green">In Stock</ToyBadge>
            </div>
            <p>
              Our fantastic collection of toy cars includes racing cars, trucks,
              and classic models that will delight children of all ages.
            </p>
          </ToyCardContent>
          <ToyCardFooter>
            <ToyButton>Shop Now</ToyButton>
          </ToyCardFooter>
        </ToyCard>

        <ToyCard>
          <ToyCardHeader>
            <ToyCardTitle>Building Blocks</ToyCardTitle>
            <ToyCardDescription>
              Creative building fun for everyone!
            </ToyCardDescription>
          </ToyCardHeader>
          <ToyCardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <ToyBadge variant="bubble.blue">Bestseller</ToyBadge>
              <ToyBadge variant="secondary">Ages 5+</ToyBadge>
            </div>
            <p>
              Develop fine motor skills and creativity with our colorful
              building blocks. Compatible with all major brands!
            </p>
          </ToyCardContent>
          <ToyCardFooter>
            <ToyButton variant="secondary">Learn More</ToyButton>
          </ToyCardFooter>
        </ToyCard>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <ToyButton>Primary Button</ToyButton>
        <ToyButton variant="secondary">Secondary</ToyButton>
        <ToyButton variant="outline">Outline</ToyButton>
        <ToyButton variant="bubble">Bubble</ToyButton>
        <ToyButton variant="crayon">Crayon</ToyButton>
      </div>
    </div>
  );
}
