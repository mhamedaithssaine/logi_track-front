/**
 * Modèles pour les commandes client (Sales Orders)
 */

export interface OrderLineDto {
  sku: string;
  quantity: number;
}

export interface SalesOrderCreateDto {
  clientId: number;
  warehouseId?: number | null;
  lines: OrderLineDto[];
}

export interface OrderLineResponseDto {
  sku: string;
  quantity: number;
  backorderQty?: number;
  productName: string;
  price: number;
}

export interface SalesOrderResponseDto {
  id: number;
  status: string;
  clientId: number;
  warehouseId?: number | null;
  warehouseName?: string | null;
  createdAt?: string;
  lines: OrderLineResponseDto[];
}

export interface SalesOrderReserveDto {
  orderId: number;
}

export interface LineReserveDto {
  id: number;
  sku: string;
  requestedQty: number;
  reservedQty: number;
  backorderQty: number;
  productName: string;
}

export interface SalesOrderReserveResponseDto {
  id: number;
  status: string;
  lines: LineReserveDto[];
  message?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
