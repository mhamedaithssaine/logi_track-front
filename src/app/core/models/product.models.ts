/**
 * Modèles TypeScript pour les produits
 * Correspondent aux DTOs Spring Boot
 */

export interface ProductCreateDto {
  sku: string;
  name: string;
  category: string;
  price: number;
  active?: boolean;
}

export interface ProductUpdateDto {
  name: string;
  category: string;
  price: number;
  active?: boolean;
}

export interface ProductResponseDto {
  id?: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

