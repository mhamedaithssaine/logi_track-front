import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductApiService } from '../../../core/api/product-api.service';
import { SupplierApiService } from '../../../core/api/supplier-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-warehouse-manager-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-manager-dashboard.html',
  styleUrl: './warehouse-manager-dashboard.scss',
})
export class WarehouseManagerDashboard implements OnInit {
  private productService = inject(ProductApiService);
  private supplierService = inject(SupplierApiService);
  private warehouseService = inject(WarehouseApiService);
  private cdr = inject(ChangeDetectorRef);

  productsCount = 0;
  suppliersCount = 0;
  warehousesCount = 0;
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    forkJoin({
      products: this.productService.getAllProducts(),
      suppliers: this.supplierService.getAllSuppliers(),
      warehouses: this.warehouseService.getAllWarehouses(),
    }).subscribe({
      next: (res) => {
        this.productsCount = res.products.length;
        this.suppliersCount = res.suppliers.length;
        this.warehousesCount = res.warehouses.length;
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.message || err?.error?.message || 'Erreur lors du chargement du tableau de bord.';
        this.loadError = msg;
        this.isLoading = false;
        toast.error(msg);
        this.cdr.detectChanges();
      },
    });
  }
}
