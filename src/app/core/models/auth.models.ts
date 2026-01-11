/**
 * Modèles TypeScript pour l'authentification
 * Correspondent aux DTOs Spring Boot
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
  active: boolean;
  message: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  path: string;
  detail?: string;
}

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
  firstName?: string;
  lastName?: string;
}

