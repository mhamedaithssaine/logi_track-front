import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShipmentApiService } from '../../../core/api/shipment-api.service';
import { OrderApiService } from '../../../core/api/order-api.service';
import { CarrierApiService } from '../../../core/api/carrier-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ShipmentFullResponseDto } from '../../../core/models/shipment.models';
import { SalesOrderResponseDto } from '../../../core/models/order.models';
import { CarrierResponseDto } from '../../../core/models/carrier.models';
import { toast } from '../../../shared/services/toast.service';

const SHIPMENT_STATUSES = ['PLANNED', 'IN_TRANSIT', 'DELIVERED'] as const;

@Component({
  selector: 'app-wm-shipment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wm-shipment-list.html',
  styleUrl: './wm-shipment-list.scss',
})
export class WmShipmentList implements OnInit {
  private shipmentApi = inject(ShipmentApiService);
  private orderApi = inject(OrderApiService);
  private carrierApi = inject(CarrierApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  shipments: ShipmentFullResponseDto[] = [];
  reservedOrders: SalesOrderResponseDto[] = [];
  carriers: CarrierResponseDto[] = [];
  warehouseId: number | null = null;
  isLoading = false;
  loadError: string | null = null;
  showCreateForm = false;
  creating = false;
  createOrderId: number | null = null;
  createCarrierCode = '';
  createTrackingNumber = '';
  updatingStatusId: number | null = null;

  readonly statuses = SHIPMENT_STATUSES;

  ngOnInit(): void {
    this.loadWarehouseThenData();
  }

  loadWarehouseThenData(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecte.';
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.wmApi.getByEmail(user.email).subscribe({
      next: (wm) => {
        this.warehouseId = wm?.warehouseId ?? null;
        this.loadShipments();
        if (this.warehouseId) {
          this.orderApi.list({ status: 'RESERVED', warehouseId: this.warehouseId, size: 100 }).subscribe({
            next: (page) => {
              this.reservedOrders = page.content ?? [];
              this.cdr.detectChanges();
            },
            error: () => {
              this.reservedOrders = [];
              this.cdr.detectChanges();
            },
          });
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.warehouseId = null;
        this.isLoading = false;
        this.loadError = 'Profil warehouse non trouve.';
        this.cdr.detectChanges();
      },
    });
  }

  loadShipments(): void {
    this.shipmentApi.listAll().subscribe({
      next: (list) => {
        this.shipments = list ?? [];
        this.loadError = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.shipments = [];
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement expeditions.';
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createOrderId = this.reservedOrders[0]?.id ?? null;
    this.createCarrierCode = this.carriers[0]?.code ?? '';
    this.createTrackingNumber = '';
    this.cdr.detectChanges();
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.createOrderId = null;
    this.createCarrierCode = '';
    this.createTrackingNumber = '';
    this.cdr.detectChanges();
  }

  submitCreate(): void {
    if (!this.createOrderId || !this.createCarrierCode.trim() || !this.createTrackingNumber.trim()) {
      toast.error('Sélectionnez une commande, un transporteur et un numéro de suivi.');
      return;
    }
    this.creating = true;
    this.cdr.detectChanges();
    this.shipmentApi.createShipment(this.createOrderId, {
      carrier: this.createCarrierCode.trim(),
      trackingNumber: this.createTrackingNumber.trim(),
    }).subscribe({
      next: () => {
        toast.success('Expedition creee.');
        this.closeCreateForm();
        this.loadShipments();
        this.creating = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur creation expedition.');
        this.creating = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateStatus(shipment: ShipmentFullResponseDto, newStatus: string): void {
    if (shipment.status === newStatus) return;
    this.updatingStatusId = shipment.shipmentId;
    this.cdr.detectChanges();
    this.shipmentApi.updateStatus(shipment.shipmentId, newStatus).subscribe({
      next: () => {
        toast.success('Statut mis a jour.');
        this.loadShipments();
        this.updatingStatusId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur mise a jour statut.');
        this.updatingStatusId = null;
        this.cdr.detectChanges();
      },
    });
  }

  isUpdating(shipment: ShipmentFullResponseDto): boolean {
    return this.updatingStatusId === shipment.shipmentId;
  }
}
