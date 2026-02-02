/**
 * Modèles pour les commandes d'achat (cahier des charges Epic ADMIN)
 */

export interface PurchaseOrderLineCreateDto {
  productId: number;
  quantity: number;
}

export interface PurchaseOrderCreateDto {
  supplierId: number;
  lines: PurchaseOrderLineCreateDto[];
}

export interface PurchaseOrderLineReceiveDto {
  receivedQuantity: number;
}

export interface PurchaseOrderReceiveDto {
  lines: PurchaseOrderLineReceiveDto[];
}

export interface PurchaseOrderResponseDto {
  id: number;
  supplierId?: number;
  status?: string;
  lines?: {
    productId?: number;
    quantity?: number;
    receivedQuantity?: number;
    productName?: string;
  }[];
}

export interface PurchaseOrderCancelResponseDto {
  message?: string;
}
