"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Crown,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Users,
  Gift,
  Shield,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function PricingPlans() {
  const { isAuthenticated } = useAuth();
  const {
    plans,
    subscription,
    isSubscribed,
    loading,
    subscribe,
    changePlan,
    loadPlans,
  } = useSubscription();
  const { toast } = useToast();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (plans.length === 0) {
      loadPlans();
    }
  }, [plans.length, loadPlans]);

  const formatDuration = (duration: string): string => {
    const numericDuration = parseInt(duration);
    switch (numericDuration) {
      case 1:
        return "month";
      case 3:
        return "3 months";
      case 6:
        return "6 months";
      case 12:
        return "year";
      default:
        return `${duration} months`;
    }
  };

  const getPlanFeatures = (plan: any) => {
    const baseFeatures = [
      {
        icon: Users,
        text: `${plan.rental_limit} rentals per month`,
      },
      { icon: Gift, text: "Access to premium toy collection" },
      { icon: Zap, text: "Free standard delivery" },
      { icon: Shield, text: "Basic damage protection" },
      { icon: Headphones, text: "Customer support" },
    ];

    if (plan.name.toLowerCase().includes("family")) {
      return [
        ...baseFeatures,
        { icon: Crown, text: "Priority customer support" },
        { icon: Shield, text: "Extended damage protection" },
        { icon: RefreshCw, text: "2 toy swaps per week" },
      ];
    }

    if (
      plan.name.toLowerCase().includes("premium") ||
      plan.name.toLowerCase().includes("ultimate")
    ) {
      return [
        ...baseFeatures,
        { icon: Crown, text: "24/7 premium customer support" },
        { icon: Shield, text: "Full damage protection" },
        { icon: RefreshCw, text: "Unlimited toy swaps" },
        { icon: Star, text: "Access to new releases first" },
        { icon: Sparkles, text: "Exclusive premium toys" },
      ];
    }

    return baseFeatures;
  };

  const isPlanPopular = (plan: any) => {
    return plan.name.toLowerCase().includes("family");
  };

  const isPlanPremium = (plan: any) => {
    return (
      plan.name.toLowerCase().includes("premium") ||
      plan.name.toLowerCase().includes("ultimate")
    );
  };

  const getPlanTheme = (plan: any) => {
    if (isPlanPremium(plan)) {
      return {
        cardClass:
          "border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        textColor: "text-purple-800",
        buttonClass:
          "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
        badgeClass: "bg-purple-600 text-white",
      };
    }
    if (isPlanPopular(plan)) {
      return {
        cardClass:
          "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl scale-105",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-blue-800",
        buttonClass:
          "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
        badgeClass: "bg-blue-600 text-white",
      };
    }
    return {
      cardClass:
        "border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-800",
      buttonClass:
        "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
      badgeClass: "bg-indigo-600 text-white",
    };
  };

  const handleSelectPlan = async (planId: number) => {
    router.push("/pricing");
  };

  const getButtonText = (plan: any) => {
    return "View Pricing Details";
  };

  const getButtonVariant = (plan: any) => {
    return "default";
  };

  const isCurrentPlan = (plan: any) => {
    return false; // No current plan logic needed for description-only view
  };

  if (loading && plans.length === 0) {
    return (
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Subscription Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading subscription plans...
            </p>
          </div>
          <div className="flex justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Subscription Plans
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Select the perfect plan for your family's playtime needs. All plans
            include access to our premium toy collection with flexible rental
            periods.
          </motion.p>
        </div>

        {/* Current Subscription Status - Show only if actually subscribed */}
        {isAuthenticated && isSubscribed && subscription && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-medium">
                Currently subscribed to {subscription.plan_name}
              </span>
              <Badge variant="secondary" className="ml-2">
                {subscription.remaining_limit} rentals left
              </Badge>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = isPlanPopular(plan);
            const isPremium = isPlanPremium(plan);
            const isCurrent = isCurrentPlan(plan);
            const isLoadingThis = actionLoading === plan.planId;
            const theme = getPlanTheme(plan);

            return (
              <motion.div
                key={plan.planId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  className={`relative flex flex-col h-full ${
                    theme.cardClass
                  } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
                >
                  {/* Badge */}
                  {(isPopular || isPremium || isCurrent) && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge
                        className={
                          isCurrent
                            ? "bg-green-600 text-white px-4 py-1"
                            : `${theme.badgeClass} px-4 py-1`
                        }
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Current Plan
                          </>
                        ) : isPopular ? (
                          <>
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </>
                        ) : (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </>
                        )}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle
                      className={`text-2xl font-bold flex items-center justify-center gap-2 ${theme.textColor}`}
                    >
                      {isPremium && <Crown className="w-5 h-5" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {plan.description ||
                        `Perfect for ${plan.name.toLowerCase()} usage`}
                    </CardDescription>

                    <div className="mt-6">
                      <div className="text-4xl font-bold text-gray-900">
                        ₸{plan.price.toLocaleString()}
                        <span className="text-lg font-normal text-gray-500">
                          {" "}
                          KZT
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">per month</p>
                    </div>

                    <div
                      className={`mt-4 p-4 ${theme.iconBg} rounded-lg border border-white/50`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Zap className={`w-5 h-5 ${theme.iconColor}`} />
                        <span className={`font-semibold ${theme.textColor}`}>
                          {plan.rental_limit} rentals per rental period
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        ≈ {Math.floor((plan.rental_limit / 30) * 4)} rentals per
                        week
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-3">
                      {getPlanFeatures(plan).map((feature, featureIndex) => {
                        const IconComponent = feature.icon;
                        return (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${theme.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <IconComponent
                                className={`w-3 h-3 ${theme.iconColor}`}
                              />
                            </div>
                            <span className="text-sm text-gray-700">
                              {feature.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      className={`w-full ${
                        isCurrent ? "" : theme.buttonClass
                      } transition-all duration-300 transform hover:scale-105`}
                      onClick={() => handleSelectPlan(plan.planId)}
                      disabled={isCurrent || isLoadingThis}
                      variant={getButtonVariant(plan)}
                    >
                      {isLoadingThis ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {getButtonText(plan)}
                          {!isCurrent && !isAuthenticated && (
                            <ArrowRight className="w-4 h-4 ml-2" />
                          )}
                        </>
                      )}
                    </Button>

                    {isAuthenticated && isSubscribed && !isCurrent && (
                      <p className="text-xs text-gray-500 text-center mt-2 w-full">
                        Your current plan will be updated immediately
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="outline"
              onClick={() =>
                router.push(isAuthenticated ? "/profile" : "/auth")
              }
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {isAuthenticated ? "Manage Subscription" : "Start"}
            </Button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose Oiyn Shak?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Flexible Plans",
                description:
                  "Change or cancel your plan anytime. No long-term commitments.",
                color: "blue",
              },
              {
                icon: Check,
                title: "Quality Guaranteed",
                description:
                  "All toys are professionally cleaned and sanitized between rentals.",
                color: "green",
              },
              {
                icon: Star,
                title: "Premium Experience",
                description:
                  "Access to 1000+ premium toys with free delivery and pickup.",
                color: "purple",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 ${
                      item.color === "blue"
                        ? "bg-blue-100"
                        : item.color === "green"
                        ? "bg-green-100"
                        : "bg-purple-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${
                        item.color === "blue"
                          ? "text-blue-600"
                          : item.color === "green"
                          ? "text-green-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
