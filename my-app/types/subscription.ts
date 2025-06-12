// types/subscription.ts - Create shared types file

export interface Plan {
  plan_id: number;
  name: string;
  description?: string;
  rental_limit: number;
  price: number;
  duration: string | number;
}

export interface Subscription {
  user_id: number;
  plan_id: number;
  plan_name: string;
  remaining_limit: number;
  expires_at: string;
}

export interface SubscriptionStatus {
  sub_status: boolean;
}

export enum OperationStatus {
  STATUS_OK = "STATUS_OK",
  STATUS_INVALID_PLAN = "STATUS_INVALID_PLAN",
  STATUS_INVALID_USER = "STATUS_INVALID_USER",
  STATUS_ALREADY_SUBSCRIBED = "STATUS_ALREADY_SUBSCRIBED",
  STATUS_NOT_SUBSCRIBED = "STATUS_NOT_SUBSCRIBED",
  STATUS_SUBSCRIPTION_NOTFOUND = "STATUS_SUBSCRIPTION_NOTFOUND",
  STATUS_INTERNAL_ERROR = "STATUS_INTERNAL_ERROR",
}

// Helper function to format duration consistently
export const formatDuration = (duration: string | number): string => {
  // Convert to string first
  const durationStr = String(duration);

  // Handle backend enum values
  switch (durationStr) {
    case "DURATION_1_MONTH":
    case "1":
      return "1 month";
    case "DURATION_3_MONTHS":
    case "3":
      return "3 months";
    case "DURATION_6_MONTHS":
    case "6":
      return "6 months";
    case "DURATION_12_MONTHS":
    case "12":
      return "1 year";
    case "DURATION_24_MONTHS":
    case "24":
      return "2 years";
    case "0":
      return "2 weeks";
    default:
      // If it's already a readable string, return as is
      if (
        durationStr.includes("month") ||
        durationStr.includes("year") ||
        durationStr.includes("week")
      ) {
        return durationStr;
      }
      // Fallback for numeric values
      const num = parseInt(durationStr);
      if (isNaN(num)) return durationStr;

      if (num === 0) return "2 weeks";
      if (num === 1) return "1 month";
      if (num === 12) return "1 year";
      if (num === 24) return "2 years";
      if (num < 12) return `${num} months`;

      const years = Math.floor(num / 12);
      const months = num % 12;
      if (months === 0) {
        return years === 1 ? "1 year" : `${years} years`;
      } else {
        return `${years} year${years > 1 ? "s" : ""} ${months} month${
          months > 1 ? "s" : ""
        }`;
      }
  }
};
