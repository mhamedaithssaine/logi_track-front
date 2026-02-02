import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/api/product-api.service';
import { ClientCartService } from '../../../core/services/client-cart.service';
import { ProductResponseDto } from '../../../core/models/product.models';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-catalogue-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './catalogue-list.html',
  styleUrl: './catalogue-list.scss',
})
export class CatalogueList implements OnInit {
  private productApi = inject(ProductApiService);
  private cart = inject(ClientCartService);
  private cdr = inject(ChangeDetectorRef);

  allProducts: ProductResponseDto[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchName = '';
  isLoading = false;
  loadError: string | null = null;

  get products(): ProductResponseDto[] {
    let list = this.allProducts;
    const q = (this.searchName || '').trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.name && p.name.toLowerCase().includes(q))
      );
    }
    const cat = (this.selectedCategory || '').trim().toLowerCase();
    if (cat) {
      list = list.filter((p) => p.category && p.category.toLowerCase() === cat);
    }
    return list;
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.productApi.getCatalogue(true).subscribe({
      next: (list) => {
        this.allProducts = list;
        const set = new Set<string>();
        list.forEach((p) => {
          if (p.category) set.add(p.category);
        });
        this.categories = Array.from(set).sort();
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement catalogue.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.cdr.detectChanges();
  }

  onCategoryChange(): void {
    this.cdr.detectChanges();
  }

  qtyBySku: Record<string, number> = {};

  getQty(sku: string): number {
    return this.qtyBySku[sku] ?? 1;
  }

  setQty(sku: string, v: number | string): void {
    const n = typeof v === 'number' ? v : parseInt(String(v), 10);
    this.qtyBySku[sku] = Math.max(1, isNaN(n) ? 1 : n);
    this.cdr.detectChanges();
  }

  reserve(p: ProductResponseDto): void {
    const qty = this.getQty(p.sku);
    if (qty < 1) {
      toast.error('Quantité minimale 1.');
      return;
    }
    if (!p.active) {
      toast.error('Produit indisponible.');
      return;
    }
    this.cart.add(p.sku, p.name, qty, p.active);
    toast.success(`"${p.name}" ajouté au panier (×${qty}).`);
    this.cdr.detectChanges();
  }
}
