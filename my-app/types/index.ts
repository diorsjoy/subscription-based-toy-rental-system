// src/types/index.ts
// Core application type definitions

// User related types
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
