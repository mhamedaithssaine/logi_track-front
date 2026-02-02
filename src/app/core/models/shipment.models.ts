/**
 * Modèles pour les expéditions / tracking
 */

export interface ShipmentLineInfo {
  sku: string;
  quantity: number;
}

export interface ShipmentFullResponseDto {
  shipmentId: number;
  orderId: number;
  trackingNumber: string;
  carrier: string;
  status: string;
  message?: string;
  plannedDeparture?: string;
  shippedAt?: string;
  deliveredAt?: string;
  lines?: ShipmentLineInfo[];
}
