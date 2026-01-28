/**
 * Modèles TypeScript pour les Warehouse Managers
 * Alignés sur les DTOs Spring Boot
 */

export interface WarehouseManagerCreateDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  warehouseId: number;
}

export interface WarehouseManagerUpdateDto {
  name?: string;
  phone?: string;
  warehouseId?: number;
}

export interface WarehouseManagerResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  active: boolean;
  warehouseId?: number;
  warehouseName?: string;
  message?: string;
}

