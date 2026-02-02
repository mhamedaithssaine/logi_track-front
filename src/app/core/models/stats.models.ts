/**
 * Modèles pour les statistiques (Admin, Warehouse, Client)
 */

export interface AdminStatsDto {
  productsCount: number;
  suppliersCount: number;
  warehousesCount: number;
  ordersCount: number;
  ordersByStatus: Record<string, number>;
  shipmentsCount: number;
  purchaseOrdersCount: number;
}

export interface WarehouseStatsDto {
  productsCount: number;
  suppliersCount: number;
  warehousesCount: number;
  ordersToReserveCount: number;
  shipmentsPlannedCount: number;
  ordersByStatus: Record<string, number>;
}

export interface ClientStatsDto {
  ordersByStatus: Record<string, number>;
  shipmentsCount: number;
}
