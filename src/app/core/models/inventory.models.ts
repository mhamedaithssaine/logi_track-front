/**
 * Modèles pour les mouvements d'inventaire (cahier des charges Epic WH)
 */

export interface InboundCreateDto {
  productId: number;
  warehouseId: number;
  quantity: number;
  referenceDoc?: string;
}

export interface OutboundCreateDto {
  productId: number;
  warehouseId: number;
  quantity: number;
  referenceDoc: string;
}

export interface AdjustmentCreateDto {
  productId: number;
  warehouseId: number;
  adjustmentQty: number;
  reason: string;
}

export interface InboundResponseDto {
  id?: number;
  productId: number;
  warehouseId: number;
  quantity?: number;
  quantityAdded?: number;
  newQtyOnHand?: number;
  referenceDoc?: string;
  message?: string;
}

export interface OutboundResponseDto {
  id?: number;
  productId: number;
  warehouseId: number;
  quantity: number;
  referenceDoc: string;
}

export interface AdjustmentResponseDto {
  id?: number;
  productId: number;
  warehouseId: number;
  adjustmentQty: number;
  reason: string;
}
