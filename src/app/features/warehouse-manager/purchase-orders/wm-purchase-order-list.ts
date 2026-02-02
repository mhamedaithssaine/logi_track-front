import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PurchaseOrderApiService } from '../../../core/api/purchase-order-api.service';
import { SupplierApiService } from '../../../core/api/supplier-api.service';
import { ProductApiService } from '../../../core/api/product-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import {
  PurchaseOrderCreateDto,
  PurchaseOrderResponseDto,
  PurchaseOrderReceiveDto,
} from '../../../core/models/purchase.models';
import { SupplierResponseDto } from '../../../core/models/supplier.models';
import { ProductResponseDto } from '../../../core/models/product.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-wm-purchase-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wm-purchase-order-list.html',
  styleUrl: './wm-purchase-order-list.scss',
})
export class WmPurchaseOrderList implements OnInit {
  private poApi = inject(PurchaseOrderApiService);
  private supplierApi = inject(SupplierApiService);
  private productApi = inject(ProductApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: SupplierResponseDto[] = [];
  allSuppliers: SupplierResponseDto[] = [];
  products: ProductResponseDto[] = [];
  purchaseOrders: PurchaseOrderResponseDto[] = [];
  warehouseId: number | null = null;
  showCreateForm = false;
  creating = false;
  createDto: PurchaseOrderCreateDto = { supplierId: 0, lines: [{ productId: 0, quantity: 1 }] };
  showReceiveForm = false;
  receivePo: PurchaseOrderResponseDto | null = null;
  receiveQuantities: number[] = [];
  receiving = false;
  isLoading = false;

  ngOnInit(): void {
    this.loadWarehouseThenData();
  }

  loadWarehouseThenData(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.cdr.detectChanges();

    this.wmApi.getByEmail(user.email).subscribe({
      next: (wm) => {
        this.warehouseId = wm.warehouseId ?? null;
        this.loadList();
        this.supplierApi.getAllSuppliers().subscribe({
          next: (list) => {
            this.allSuppliers = list ?? [];
            this.suppliers =
              this.warehouseId != null
                ? this.allSuppliers.filter((s) => s.warehouseId === this.warehouseId)
                : this.allSuppliers;
            this.cdr.detectChanges();
          },
          error: () => {
            this.allSuppliers = [];
            this.suppliers = [];
            this.cdr.detectChanges();
          },
        });
        this.productApi.getAllProducts().subscribe({
          next: (list) => {
            this.products = list ?? [];
            this.cdr.detectChanges();
          },
          error: () => {
            this.products = [];
            this.cdr.detectChanges();
          },
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
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

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.cdr.detectChanges();
  }

  addLine(): void {
    this.createDto.lines.push({
      productId: this.products[0]?.id ?? 0,
      quantity: 1,
    });
    this.cdr.detectChanges();
  }

  loadList(): void {
    this.poApi.getAll().subscribe({
      next: (list) => {
        this.purchaseOrders = list ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.purchaseOrders = [];
        this.cdr.detectChanges();
      },
    });
  }

  removeLine(index: number): void {
    if (this.createDto.lines.length > 1) {
      this.createDto.lines.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  submitCreate(): void {
    if (!this.createDto.supplierId || this.createDto.lines.length === 0) {
      toast.error('Fournisseur et au moins une ligne requis.');
      return;
    }
    const validLines = this.createDto.lines.filter((l) => l.productId && l.quantity > 0);
    if (validLines.length === 0) {
      toast.error('Chaque ligne doit avoir un produit et une quantité > 0.');
      return;
    }
    this.creating = true;
    this.cdr.detectChanges();
    this.poApi
      .create({ supplierId: this.createDto.supplierId, lines: validLines })
      .subscribe({
        next: () => {
          toast.success('Commande d\'achat créée.');
          this.closeCreateForm();
          this.loadList();
          this.creating = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          toast.error(err?.message || err?.error?.message || 'Erreur.');
          this.creating = false;
          this.cdr.detectChanges();
        },
      });
  }

  openReceive(po: PurchaseOrderResponseDto): void {
    if (po.status !== 'APPROVED') return;
    this.receivePo = po;
    this.receiveQuantities = (po.lines ?? []).map((l) => l.receivedQuantity ?? 0);
    this.showReceiveForm = true;
    this.cdr.detectChanges();
  }

  closeReceiveForm(): void {
    this.showReceiveForm = false;
    this.receivePo = null;
    this.receiveQuantities = [];
    this.cdr.detectChanges();
  }

  submitReceive(): void {
    if (!this.receivePo) return;
    const dto: PurchaseOrderReceiveDto = {
      lines: this.receiveQuantities.map((q) => ({ receivedQuantity: q })),
    };
    this.receiving = true;
    this.cdr.detectChanges();
    this.poApi.receive(this.receivePo.id, dto).subscribe({
      next: () => {
        toast.success('Réception enregistrée.');
        this.closeReceiveForm();
        this.loadList();
        this.receiving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur réception.');
        this.receiving = false;
        this.cdr.detectChanges();
      },
    });
  }

  canReceive(po: PurchaseOrderResponseDto): boolean {
    return po.status === 'APPROVED';
  }

  getLineProductName(line: { productId?: number; productName?: string }): string {
    if (line.productName) return line.productName;
    const p = this.products.find((x) => x.id === line.productId);
    return p ? `${p.sku} - ${p.name}` : `Produit #${line.productId}`;
  }

  getSupplierName(supplierId?: number): string {
    if (!supplierId) return '—';
    const s = this.allSuppliers.find((x) => x.id === supplierId);
    return s?.name ?? `Fournisseur #${supplierId}`;
  }
}
