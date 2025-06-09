// types/subscription.ts
export interface Plan {
  plan_id: number;
  name: string;
  description?: string;
  rental_limit: number;
  price: number;
  duration: string; // "1/3/6/12 месяцев"
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
