/**
 * Modèles TypeScript pour les entrepôts (warehouses)
 * Correspondent aux DTOs Spring Boot
 */

export interface WarehouseCreateDto {
  code: string;
  name: string;
}

export interface WarehouseUpdateDto {
  name: string;
}

export interface WarehouseResponseDto {
  id: number;
  code: string;
  name: string;
  message?: string;
}
