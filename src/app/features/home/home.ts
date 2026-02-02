import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/api/product-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { ClientCartService } from '../../core/services/client-cart.service';
import { ProductResponseDto } from '../../core/models/product.models';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { toast } from '../../shared/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private productApi = inject(ProductApiService);
  authService = inject(AuthService);
  private cartService = inject(ClientCartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  allProducts: ProductResponseDto[] = [];
  categories: string[] = [];
  selectedCategory = '';
  isLoading = false;
  loadError: string | null = null;
  qtyBySku: Record<string, number> = {};

  get products(): ProductResponseDto[] {
    let list = this.allProducts;
    const cat = (this.selectedCategory || '').trim().toLowerCase();
    if (cat) {
      list = list.filter((p) => p.category && p.category.toLowerCase() === cat);
    }
    return list;
  }

  get isClient(): boolean {
    return this.authService.hasRole('CLIENT');
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
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement du catalogue.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  onCategoryChange(): void {
    this.cdr.detectChanges();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.cdr.detectChanges();
  }

  getQty(sku: string): number {
    return this.qtyBySku[sku] ?? 1;
  }

  setQty(sku: string, v: number): void {
    this.qtyBySku[sku] = Math.max(1, Math.min(99, v));
    this.cdr.detectChanges();
  }

  reserve(p: ProductResponseDto): void {
    if (!p.active) {
      toast.error('Produit indisponible.');
      return;
    }
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      toast.error('Connectez-vous pour réserver.');
      return;
    }
    if (!this.isClient) {
      toast.error('Réservation réservée aux clients.');
      return;
    }
    const qty = this.getQty(p.sku);
    if (qty < 1) {
      toast.error('Quantité minimale 1.');
      return;
    }
    this.cartService.add(p.sku, p.name, qty, p.active);
    toast.success(`"${p.name}" ajouté au panier (×${qty}). Accédez à Mon espace pour valider.`);
    this.cdr.detectChanges();
  }
}
