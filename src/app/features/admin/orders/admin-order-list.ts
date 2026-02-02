import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderApiService } from '../../../core/api/order-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import { SalesOrderResponseDto, Page } from '../../../core/models/order.models';
import { WarehouseResponseDto } from '../../../core/models/warehouse.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-list.html',
  styleUrl: './admin-order-list.scss',
})
export class AdminOrderList implements OnInit {
  private orderApi = inject(OrderApiService);
  private warehouseApi = inject(WarehouseApiService);
  private cdr = inject(ChangeDetectorRef);

  orders: SalesOrderResponseDto[] = [];
  warehouses: WarehouseResponseDto[] = [];
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 15;
  statusFilter = '';
  isLoading = false;
  loadError: string | null = null;
  confirmingId: number | null = null;
  assigningId: number | null = null;
  selectedWarehouseByOrderId: Record<number, number> = {};

  readonly statuses = ['CREATED', 'CONFIRMED', 'RESERVED', 'PARTIAL_RESERVED', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.orderApi
      .list({
        status: this.statusFilter || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (p: Page<SalesOrderResponseDto>) => {
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
    this.load();
  }

  goPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.load();
  }

  canAssignWarehouse(o: SalesOrderResponseDto): boolean {
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
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: { message?: string; error?: { message?: string } }) => {
        toast.error(err?.message || err?.error?.message || 'Erreur assignation.');
        this.assigningId = null;
        this.cdr.detectChanges();
      },
    });
  }

  confirm(id: number): void {
    if (!confirm("Confirmer cette commande pour le responsable d'entrepôt ?")) return;
    this.confirmingId = id;
    this.cdr.detectChanges();

    this.orderApi.confirm(id).subscribe({
      next: () => {
        toast.success('Commande confirmée.');
        this.confirmingId = null;
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: { message?: string; error?: { message?: string } }) => {
        toast.error(err?.message || err?.error?.message || 'Erreur confirmation.');
        this.confirmingId = null;
        this.cdr.detectChanges();
      },
    });
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

