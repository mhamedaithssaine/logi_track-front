/**
 * Modèles TypeScript pour les fournisseurs (suppliers)
 * Correspondent aux DTOs Spring Boot
 */

export interface SupplierCreateDto {
  name: string;
  contact?: string;
  warehouseId?: number;
}

export interface SupplierUpdateDto {
  name: string;
  contact?: string;
  warehouseId?: number;
}

export interface SupplierResponseDto {
  id: number;
  name: string;
  contact?: string;
  warehouseId?: number;
  warehouseName?: string;
  message?: string;
}
