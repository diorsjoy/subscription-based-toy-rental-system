// types/toy.ts
export enum ToyCategory {
  EDUCATIONAL = "educational",
  ACTION = "action",
  CREATIVE = "creative",
  ELECTRONIC = "electronic",
  BUILDING = "building",
  OUTDOOR = "outdoor",
  ROLE_PLAY = "role_play",
}

export enum ToyCondition {
  NEW = "new",
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
}

export interface Toy {
  id: number;
  name: string;
  description: string;
  category: ToyCategory;
  age_range: string;
  token_cost: number;
  is_available: boolean;
  rating: number;
  image_url: string;
  manufacturer: string;
  condition: ToyCondition;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface MappedToy {
  id: number;
  name: string;
  description: string;
  category: ToyCategory;
  ageRange: string;
  tokenCost: number;
  isAvailable: boolean;
  rating: number;
  imageUrl: string;
  manufacturer: string;
  condition: ToyCondition;
  tags: string[];
  canRent: boolean;
  requiresSubscription: boolean;
  insufficientLimit: boolean;
}

export interface ToyFilters {
  category?: ToyCategory;
  ageRange?: string;
  maxPrice?: number;
  available?: boolean;
  condition?: ToyCondition;
  search?: string;
  sortBy?: "name" | "price" | "rating" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface GetToysResponse {
  toys: Toy[];
  total: number;
}
