import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderApiService } from '../../../core/api/order-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SalesOrderResponseDto } from '../../../core/models/order.models';
import { WarehouseResponseDto } from '../../../core/models/warehouse.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-wm-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wm-order-list.html',
  styleUrl: './wm-order-list.scss',
})
export class WmOrderList implements OnInit {
  private orderApi = inject(OrderApiService);
  private warehouseApi = inject(WarehouseApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  orders: SalesOrderResponseDto[] = [];
  warehouses: WarehouseResponseDto[] = [];
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 15;
  statusFilter = 'CONFIRMED';
  warehouseId: number | null = null;
  isLoading = false;
  loadError: string | null = null;
  noWarehouse = false;
  reservingId: number | null = null;
  assigningId: number | null = null;
  selectedWarehouseByOrderId: Record<number, number> = {};

  readonly statuses = ['CREATED', 'CONFIRMED', 'RESERVED', 'PARTIAL_RESERVED', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  ngOnInit(): void {
    this.loadWarehouseThenOrders();
  }

  loadWarehouseThenOrders(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecte.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.loadError = null;
    this.noWarehouse = false;
    this.cdr.detectChanges();

    const onWm = (whId: number | null) => {
      this.warehouseId = whId ?? null;
      this.noWarehouse = !this.warehouseId;
      if (this.warehouseId) {
        this.loadOrders();
        this.warehouseApi.getAllWarehouses().subscribe({
          next: (list) => {
            const all = list ?? [];
            this.warehouses = all.filter((w) => w.id === this.warehouseId);
            this.cdr.detectChanges();
          },
          error: () => {
            this.warehouses = [];
            this.cdr.detectChanges();
          },
        });
      } else {
        this.isLoading = false;
        this.loadError = "Assignez un entrepot a votre profil pour voir les commandes.";
        this.cdr.detectChanges();
      }
    };

    this.wmApi.getById(user.id).subscribe({
      next: (wm) => onWm(wm.warehouseId ?? null),
      error: () => {
        this.wmApi.getByEmail(user.email).subscribe({
          next: (wm) => onWm(wm.warehouseId ?? null),
          error: () => {
            this.loadError = 'Profil responsable introuvable.';
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
    });
  }

  loadOrders(): void {
    if (!this.warehouseId) return;
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.orderApi
      .list({
        warehouseId: this.warehouseId,
        status: this.statusFilter || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (p) => {
          this.orders = p.content;
          this.totalElements = p.totalElements;
          this.totalPages = p.totalPages;
          this.loadError = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loadError = err?.message || err?.error?.message || 'Erreur chargement commandes.';
          this.isLoading = false;
          toast.error(this.loadError ?? 'Erreur');
          this.cdr.detectChanges();
        },
      });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadOrders();
  }

  goPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadOrders();
  }

  reserve(id: number): void {
    this.reservingId = id;
    this.cdr.detectChanges();

    this.orderApi.reserve(id).subscribe({
      next: () => {
        toast.success('Commande réservée.');
        this.reservingId = null;
        this.loadOrders();
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur reservation.');
        this.reservingId = null;
        this.cdr.detectChanges();
      },
    });
  }

  canAssign(o: SalesOrderResponseDto): boolean {
    const unassigned = o.warehouseId == null && (o.warehouseName == null || o.warehouseName === '');
    return (o.status === 'CREATED' || o.status === 'CONFIRMED') && unassigned && this.assigningId !== o.id;
  }

  assignWarehouse(orderId: number): void {
    const whId = this.selectedWarehouseByOrderId[orderId];
    if (!whId) {
      toast.error('Choisissez un entrepôt.');
      return;
    }
    this.assigningId = orderId;
    this.cdr.detectChanges();

    this.orderApi.assignWarehouse(orderId, whId).subscribe({
      next: () => {
        toast.success('Entrepôt assigné.');
        this.assigningId = null;
        delete this.selectedWarehouseByOrderId[orderId];
        this.loadOrders();
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur assignation.');
        this.assigningId = null;
        this.cdr.detectChanges();
      },
    });
  }

  canReserve(o: SalesOrderResponseDto): boolean {
    const hasWarehouse = o.warehouseId != null || (o.warehouseName != null && o.warehouseName !== '');
    return (o.status === 'CREATED' || o.status === 'CONFIRMED') && hasWarehouse && this.reservingId !== o.id;
  }

  formatDate(d: string | undefined): string {
    if (!d) return '–';
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString('fr-FR', { dateStyle: 'short' }) + ' ' + dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(d);
    }
  }
}
