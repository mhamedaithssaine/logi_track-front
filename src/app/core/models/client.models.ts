/**
 * Modèles TypeScript pour les Clients
 * Alignés sur les DTOs Spring Boot
 */

export interface ClientCreateDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

export interface ClientUpdateDto {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
}

export interface ClientResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  active: boolean;
  message?: string;
}

