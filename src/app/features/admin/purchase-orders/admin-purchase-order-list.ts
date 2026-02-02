import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderApiService } from '../../../core/api/purchase-order-api.service';
import { SupplierApiService } from '../../../core/api/supplier-api.service';
import { ProductApiService } from '../../../core/api/product-api.service';
import { PurchaseOrderCreateDto, PurchaseOrderResponseDto } from '../../../core/models/purchase.models';
import { SupplierResponseDto } from '../../../core/models/supplier.models';
import { ProductResponseDto } from '../../../core/models/product.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-purchase-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-purchase-order-list.html',
  styleUrl: './admin-purchase-order-list.scss',
})
export class AdminPurchaseOrderList {
  private poApi = inject(PurchaseOrderApiService);
  private supplierApi = inject(SupplierApiService);
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: SupplierResponseDto[] = [];
  products: ProductResponseDto[] = [];
  purchaseOrders: PurchaseOrderResponseDto[] = [];
  showCreateForm = false;
  creating = false;
  createDto: PurchaseOrderCreateDto = { supplierId: 0, lines: [{ productId: 0, quantity: 1 }] };

  ngOnInit(): void {
    this.loadList();
    this.supplierApi.getAllSuppliers().subscribe({
      next: (list) => { this.suppliers = list ?? []; this.cdr.detectChanges(); },
      error: () => { this.suppliers = []; this.cdr.detectChanges(); },
    });
    this.productApi.getAllProducts().subscribe({
      next: (list) => { this.products = list ?? []; this.cdr.detectChanges(); },
      error: () => { this.products = []; this.cdr.detectChanges(); },
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createDto = {
      supplierId: this.suppliers[0]?.id ?? 0,
      lines: [{ productId: this.products[0]?.id ?? 0, quantity: 1 }],
    };
    this.cdr.detectChanges();
  }

  closeCreateForm(): void { this.showCreateForm = false; this.cdr.detectChanges(); }

  addLine(): void {
    this.createDto.lines.push({ productId: this.products[0]?.id ?? 0, quantity: 1 });
    this.cdr.detectChanges();
  }

  loadList(): void {
    this.poApi.getAll().subscribe({
      next: (list) => { this.purchaseOrders = list ?? []; this.cdr.detectChanges(); },
      error: () => { this.purchaseOrders = []; this.cdr.detectChanges(); },
    });
  }

  removeLine(index: number): void {
    if (this.createDto.lines.length > 1) { this.createDto.lines.splice(index, 1); this.cdr.detectChanges(); }
  }

  submitCreate(): void {
    if (!this.createDto.supplierId || this.createDto.lines.length === 0) {
      toast.error("Fournisseur et au moins une ligne requis.");
      return;
    }
    const validLines = this.createDto.lines.filter((l) => l.productId && l.quantity > 0);
    if (validLines.length === 0) {
      toast.error("Chaque ligne doit avoir un produit et une quantite > 0.");
      return;
    }
    this.creating = true;
    this.cdr.detectChanges();
    this.poApi.create({ supplierId: this.createDto.supplierId, lines: validLines }).subscribe({
      next: (res) => {
        toast.success("Commande d achat creee.");
        this.closeCreateForm();
        this.creating = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || "Erreur.");
        this.creating = false;
        this.cdr.detectChanges();
      },
    });
  }
}
