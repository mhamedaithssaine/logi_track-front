import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductApiService } from '../../../core/api/product-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import { InventoryApiService } from '../../../core/api/inventory-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ProductResponseDto } from '../../../core/models/product.models';
import { WarehouseResponseDto } from '../../../core/models/warehouse.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-wm-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wm-inventory.html',
  styleUrl: './wm-inventory.scss',
})
export class WmInventory implements OnInit {
  private productApi = inject(ProductApiService);
  private warehouseApi = inject(WarehouseApiService);
  private inventoryApi = inject(InventoryApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  products: ProductResponseDto[] = [];
  warehouses: WarehouseResponseDto[] = [];
  productId: number | null = null;
  warehouseId: number | null = null;
  quantity = 1;
  referenceDoc = '';
  submitting = false;
  isLoading = false;
  noWarehouse = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.isLoading = false;
      this.noWarehouse = true;
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.noWarehouse = false;
    this.cdr.detectChanges();

    this.wmApi.getByEmail(user.email).subscribe({
      next: (wm) => {
        const myWarehouseId = wm.warehouseId ?? null;
        if (!myWarehouseId) {
          this.warehouses = [];
          this.noWarehouse = true;
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        forkJoin({
          products: this.productApi.getAllProducts(),
          warehouses: this.warehouseApi.getAllWarehouses(),
        }).subscribe({
          next: ({ products, warehouses }) => {
            this.products = products ?? [];
            const all = warehouses ?? [];
            this.warehouses = all.filter((w) => w.id === myWarehouseId);
            if (this.warehouses.length && !this.warehouseId) this.warehouseId = this.warehouses[0].id;
            if (this.products.length && !this.productId) this.productId = this.products[0].id ?? null;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.products = [];
            this.warehouses = [];
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.noWarehouse = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  submitInbound(): void {
    const pid = this.productId ?? 0;
    const wid = this.warehouseId ?? 0;
    if (!pid || !wid) {
      toast.error('Sélectionnez un produit et un entrepôt.');
      return;
    }
    if (this.quantity <= 0) {
      toast.error('La quantité doit être strictement positive.');
      return;
    }
    this.submitting = true;
    this.cdr.detectChanges();
    this.inventoryApi.recordInbound({
      productId: pid,
      warehouseId: wid,
      quantity: this.quantity,
      referenceDoc: this.referenceDoc || undefined,
    }).subscribe({
      next: (res) => {
        toast.success(res.message || 'Réception enregistrée.');
        this.quantity = 1;
        this.referenceDoc = '';
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur lors de la réception.');
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
