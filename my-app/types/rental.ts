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
