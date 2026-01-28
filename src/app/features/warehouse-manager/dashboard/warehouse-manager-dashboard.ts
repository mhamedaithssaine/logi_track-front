import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../../core/api/product-api.service';
import { SupplierApiService } from '../../../core/api/supplier-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';

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

  productsCount = 0;
  suppliersCount = 0;
  warehousesCount = 0;

  ngOnInit(): void {
    this.loadProductsCount();
    this.loadSuppliersCount();
    this.loadWarehousesCount();
  }

  loadProductsCount(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => (this.productsCount = products.length),
      error: (e) => console.error('Produits:', e),
    });
  }

  loadSuppliersCount(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => (this.suppliersCount = suppliers.length),
      error: (e) => console.error('Fournisseurs:', e),
    });
  }

  loadWarehousesCount(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => (this.warehousesCount = warehouses.length),
      error: (e) => console.error('Entrepôts:', e),
    });
  }
}
