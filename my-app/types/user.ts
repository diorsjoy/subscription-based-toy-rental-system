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
