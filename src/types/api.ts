export type UserRole = 'guest' | 'user' | 'admin';

export interface UserPublic {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserPublic;
}

export interface UserListResponse {
  users: UserPublic[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminUserCreate {
  email: string;
  full_name?: string;
  password: string;
  role: 'user' | 'admin';
  is_active?: boolean;
}

export interface AdminUserUpdate {
  full_name?: string;
  role?: 'user' | 'admin';
  is_active?: boolean;
  is_verified?: boolean;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserProfileUpdate {
  full_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  is_admin?: boolean;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface HealthResponse {
  status: string;
}