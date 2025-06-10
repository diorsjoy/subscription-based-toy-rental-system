export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  tokenBalance: number;
  membership?: MembershipTier;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: "en" | "ru" | "kk";
  currency: "KZT";
  notifications: NotificationPreferences;
  marketing: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  rentalReminders: boolean;
  returnDeadlines: boolean;
  promotions: boolean;
  newArrivals: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Address {
  id: string;
  userId: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  label?: "home" | "work" | "other";
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Token related types
export interface TokenPackage {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
  currency: "KZT";
  discount?: number;
  isPopular?: boolean;
  durationInDays?: number;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  balance: number;
  type: "purchase" | "rental" | "refund" | "extension" | "damage" | "bonus";
  description: string;
  reference?: string;
  rentalId?: string;
  packageId?: string;
  createdAt: string;
}

export interface TokenPurchase {
  packageId: string;
  paymentMethod: "card" | "paypal" | "applepay" | "googlepay";
  currency: "KZT";
}

export interface CurrencyRate {
  base: "KZT";
  rates: {
    [currency: string]: number;
  };
  lastUpdated: string;
}

// Toy related types
export interface Toy {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  brand: string;
  ageMin: number;
  ageMax: number;
  pricePerDay: number;
  basePrice: number;
  inventoryCount: number;
  availableCount: number;
  images: string[];
  thumbnailUrl: string;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: "cm" | "in";
  };
  weight?: {
    value: number;
    unit: "kg" | "lb";
  };
  materials?: string[];
  isActive: boolean;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToyCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  slug: string;
  toyCount: number;
}

export interface ToyReview {
  id: string;
  userId: string;
  userName: string;
  toyId: string;
  rating: number;
  review?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  rentalId: string;
  verifiedRental: boolean;
}

export interface ToySearchFilters {
  searchTerm?: string;
  categoryId?: string;
  ageMin?: number;
  ageMax?: number;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?:
    | "relevance"
    | "newest"
    | "priceAsc"
    | "priceDesc"
    | "popularity"
    | "rating";
  page?: number;
  limit?: number;
  tags?: string[];
}

export interface ToySearchResponse {
  items: Toy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cart related types
export interface CartItem {
  id: string;
  toyId: string;
  name: string;
  imageUrl: string;
  category: string;
  ageMin: number;
  ageMax: number;
  pricePerDay: number;
  basePrice: number;
  quantity: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  availableStock: number;
}

export interface CartState {
  items: CartItem[];
  pickupLocation: PickupLocation | null;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  isActive: boolean;
}

export interface WorkingHours {
  isOpen: boolean;
  open: string;
  close: string;
}

// Rental related types
export interface Rental {
  id: string;
  userId: string;
  status: RentalStatus;
  tokenAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  items: RentalItem[];
  location?: PickupLocation;
  address?: Address;
  deliveryOption: "pickup" | "delivery";
  trackingInfo?: TrackingInfo;
  promoCode?: string;
  promoDiscount?: number;
  lateFeesIncurred?: number;
  damageFeesIncurred?: number;
  notes?: string;
}

export interface RentalItem {
  id: string;
  rentalId: string;
  toyId: string;
  toy: Toy;
  quantity: number;
  pricePerDay: number;
  duration: number;
  status: RentalItemStatus;
  condition: ToyCondition;
  returnedAt?: string;
  damageReported?: boolean;
  damageDescription?: string;
  damageImages?: string[];
  damageFees?: number;
}

export type RentalStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out_for_delivery"
  | "picked_up"
  | "active"
  | "return_requested"
  | "return_approved"
  | "return_in_transit"
  | "returned"
  | "completed"
  | "cancelled"
  | "expired";

export type RentalItemStatus =
  | "pending"
  | "rented"
  | "return_requested"
  | "returned"
  | "damaged"
  | "lost";

export type ToyCondition =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "damaged"
  | "lost";

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface RentalExtension {
  rentalId: string;
  additionalDays: number;
  newEndDate: string;
  tokenAmount: number;
}

export interface RentalFilter {
  status?: RentalStatus | RentalStatus[];
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Membership related types
export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  currency: "KZT";
  tokenBonus: number;
  discountPercentage: number;
  freeDelivery: boolean;
  prioritySupport: boolean;
  earlyAccess: boolean;
  maxActiveRentals: number;
  maxRentalDuration: number;
  features: string[];
}

// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
  actionText?: string;
  createdAt: string;
}

export type NotificationType =
  | "rental_confirmation"
  | "rental_status_update"
  | "rental_reminder"
  | "return_reminder"
  | "return_confirmation"
  | "token_purchase"
  | "token_usage"
  | "promo"
  | "system";

// Damage and late return policies
export interface LateReturnPolicy {
  gracePeriodDays: number;
  feePerDay: number;
  maxFeePercentage: number;
}

export interface DamagePolicy {
  minorDamageFee: number;
  majorDamageFee: number;
  replacementFeePercentage: number;
}

// Referral program
export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  referredUserId?: string;
  status: "pending" | "registered" | "completed" | "expired";
  bonusAmount: number;
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

export interface ReferralProgram {
  referrerBonus: number;
  referredBonus: number;
  expirationDays: number;
  minimumRentalForBonus: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Redux state root types
export interface RootState {
  auth: AuthState;
  toys: ToysState;
  cart: CartState;
  rentals: RentalsState;
  tokens: TokensState;
  profile: ProfileState;
  notifications: NotificationsState;
  ui: UiState;
}

export interface ToysState {
  items: Toy[];
  featured: Toy[];
  recentlyViewed: Toy[];
  recommended: Toy[];
  categories: ToyCategory[];
  currentToy: Toy | null;
  searchResults: ToySearchResponse | null;
  maxPrice: number;
  isLoading: boolean;
  isSearchLoading: boolean;
  error: string | null;
}

export interface RentalsState {
  items: Rental[];
  currentRental: Rental | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export interface TokensState {
  balance: number;
  packages: TokenPackage[];
  transactions: TokenTransaction[];
  totalTransactions: number;
  page: number;
  limit: number;
  totalPages: number;
  currencyRates: CurrencyRate | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProfileState {
  addresses: Address[];
  membership: MembershipTier | null;
  referrals: Referral[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  hasUnread: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UiState {
  theme: "light" | "dark" | "system";
  language: "en" | "ru" | "kk";
  sidebarOpen: boolean;
  notifications: {
    show: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null;
  modal: {
    show: boolean;
    content: string;
    title: string;
  } | null;
}

// Redux action types (simplified, actual implementation would use Redux Toolkit)
export interface Action<T = any> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// types/subscription.ts
export enum SubscriptionStatus {
  STATUS_OK = "STATUS_OK",
  STATUS_INVALID_PLAN = "STATUS_INVALID_PLAN",
  STATUS_INVALID_USER = "STATUS_INVALID_USER",
  STATUS_ALREADY_SUBSCRIBED = "STATUS_ALREADY_SUBSCRIBED",
  STATUS_SUBSCRIPTION_NOTFOUND = "STATUS_SUBSCRIPTION_NOTFOUND",
  STATUS_INTERNAL_ERROR = "STATUS_INTERNAL_ERROR",
  STATUS_INSUFFICIENT_BALANCE = "STATUS_INSUFFICIENT_BALANCE",
}

export interface SubscriptionPlan {
  plan_id: number;
  name: string;
  rental_limit: number;
  price: number;
  duration: string;
}

export interface MappedSubscriptionPlan {
  id: number;
  name: string;
  rentalLimit: number;
  price: number;
  duration: string;
  pricePerRental: number;
  features: string[];
  isPremium: boolean;
}

export interface SubscriptionDetails {
  user_id: number;
  plan_id: number;
  plan_name: string;
  remaining_limit: number;
  expires_at: string;
  created_at: string;
  is_active: boolean;
}

export interface SubscriptionCheckResponse {
  sub_status: boolean;
}

export interface SubscribeRequest {
  user_id: number;
  plan_id: number;
}

export interface SubscribeResponse {
  sub_id: number;
  status: SubscriptionStatus;
}

export interface ChangePlanRequest {
  user_id: number;
  new_plan_id: number;
}

export interface ChangePlanResponse {
  status: SubscriptionStatus;
}

export interface UnsubscribeRequest {
  user_id: number;
}

export interface UnsubscribeResponse {
  status: SubscriptionStatus;
}

export interface BalanceRequest {
  value: number;
}

export interface BalanceResponse {
  op_status: SubscriptionStatus;
  msg: string;
  left: number;
}

// types/rental.ts
export enum RentalStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  OVERDUE = "overdue",
  EXTENDED = "extended",
  CANCELLED = "cancelled",
}

export interface Rental {
  id: number;
  user_id: number;
  toy_id: number;
  toy_name: string;
  start_date: string;
  end_date: string;
  status: RentalStatus;
  total_cost: number;
  is_extended: boolean;
  return_date?: string;
  late_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface MappedRental {
  id: number;
  toyId: number;
  toyName: string;
  startDate: Date;
  endDate: Date;
  status: RentalStatus;
  totalCost: number;
  isExtended: boolean;
  returnDate?: Date;
  lateFee?: number;
  daysRemaining: number;
  isOverdue: boolean;
}

export interface RentToyRequest {
  toy_id: number;
  rental_duration_days: number;
  user_id: number;
}

export interface RentToyResponse {
  rental_id: number;
  success: boolean;
  message: string;
}

export interface ReturnToyRequest {
  rental_id: number;
}

export interface ExtendRentalRequest {
  rental_id: number;
  additional_days: number;
}

export interface GetUserRentalsResponse {
  rentals: Rental[];
}

// types/user.ts
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  avatar_url?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
  expires_at: string;
}

export interface UserProfile {
  user: User;
  subscription?: SubscriptionDetails;
  stats: {
    total_rentals: number;
    active_rentals: number;
    favorite_category: string;
  };
}

// types/payment.ts
export enum PaymentMethod {
  KASPI = "kaspi",
  HALYK = "halyk",
  STRIPE = "stripe",
  CASH = "cash",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface Payment {
  id: number;
  user_id: number;
  plan_id?: number;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  external_payment_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  plan_id?: number;
  payment_method: PaymentMethod;
  user_id: number;
}

export interface CreatePaymentResponse {
  payment_id: number;
  payment_url: string;
  external_payment_id: string;
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
  payment: Payment;
}

// types/hooks.ts
export interface UseSubscriptionReturn {
  isActive: boolean;
  details: SubscriptionDetails | null;
  plans: MappedSubscriptionPlan[];
  loading: boolean;
  error: string | null;
  actionLoading: {
    subscribing: boolean;
    changingPlan: boolean;
    unsubscribing: boolean;
  };
  subscribe: (
    planId: number
  ) => Promise<{ success: boolean; error?: string; subscriptionId?: number }>;
  changePlan: (
    newPlanId: number
  ) => Promise<{ success: boolean; error?: string }>;
  unsubscribe: () => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export interface UseToysReturn {
  toys: MappedToy[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseRentalsReturn {
  rentals: MappedRental[];
  loading: boolean;
  error: string | null;
  actionLoading: Record<string, boolean>;
  rentToy: (
    toyId: number,
    duration?: number
  ) => Promise<{ success: boolean; error?: string; rentalId?: number }>;
  returnToy: (
    rentalId: number
  ) => Promise<{ success: boolean; error?: string }>;
  extendRental: (
    rentalId: number,
    additionalDays: number
  ) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterRequest
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export interface UsePaymentReturn {
  paymentHistory: Payment[];
  loading: boolean;
  error: string | null;
  createPayment: (
    amount: number,
    planId: number,
    paymentMethod?: PaymentMethod
  ) => Promise<{
    success: boolean;
    error?: string;
    paymentUrl?: string;
    paymentId?: number;
  }>;
  checkPaymentStatus: (paymentId: number) => Promise<PaymentStatusResponse>;
  loadPaymentHistory: () => Promise<void>;
}

// types/notification.ts
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timeout?: number | false;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => number;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

// types/websocket.ts
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface SubscriptionUpdateMessage {
  type: "subscription_updated";
  payload: {
    user_id: number;
    subscription: SubscriptionDetails;
  };
}

export interface RentalReminderMessage {
  type: "rental_reminder";
  payload: {
    user_id: number;
    rental: Rental;
    days_until_due: number;
  };
}

export interface ToyAvailableMessage {
  type: "toy_available";
  payload: {
    toy: Toy;
    user_ids: number[];
  };
}

export type WSMessage =
  | SubscriptionUpdateMessage
  | RentalReminderMessage
  | ToyAvailableMessage;

export interface UseWebSocketReturn {
  connected: boolean;
  wsManager: WebSocketManager | null;
}

// types/context.ts
export interface SubscriptionContextType extends UseSubscriptionReturn {
  auth: UseAuthReturn;
  notifications: UseNotificationsReturn;
  ws: UseWebSocketReturn;
}

// types/config.ts
export interface APIConfig {
  API_BASE_URL: string;
  WS_URL: string;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
}

export interface AppConfig {
  development: APIConfig;
  staging: APIConfig;
  production: APIConfig;
}

// types/error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// types/components.ts
export interface ToyCardProps {
  toy: MappedToy;
  onRent?: (toyId: number) => void;
  compact?: boolean;
}

export interface SubscriptionPlanCardProps {
  plan: MappedSubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (plan: MappedSubscriptionPlan) => void;
  loading?: boolean;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitch: () => void;
}

export interface RentalCardProps {
  rental: MappedRental;
  onReturn: (rentalId: number) => void;
  onExtend: (rentalId: number) => void;
  actionLoading: Record<string, boolean>;
}

export interface NotificationProps {
  notification: Notification;
  onRemove: (id: number) => void;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// types/form.ts
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "textarea"
    | "select"
    | "number";
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { value: string; label: string }[];
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormReturn {
  data: FormData;
  errors: FormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  clearErrors: () => void;
  handleSubmit: (
    onSubmit: (data: FormData) => Promise<void>
  ) => (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}
