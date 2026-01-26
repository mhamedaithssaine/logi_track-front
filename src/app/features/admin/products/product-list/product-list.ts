import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../../../core/api/product-api.service';
import { ProductResponseDto } from '../../../../core/models/product.models';
import { toast } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private productService = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);

  products: ProductResponseDto[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force change detection before async operation

    this.productService
      .getAllProducts()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck(); // Mark for check after async operation completes
        })
      )
      .subscribe({
        next: (products) => {
          this.products = products;
          this.cdr.markForCheck(); // Ensure change detection runs after state update
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors du chargement des produits');
          this.cdr.markForCheck();
        },
      });
  }

  deleteProduct(sku: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService
        .deleteProduct(sku)
        .pipe(finalize(() => this.cdr.markForCheck()))
        .subscribe({
          next: () => {
            toast.success('Produit supprimé avec succès');
            this.loadProducts();
          },
          error: (error) => {
            toast.error(error.message || 'Erreur lors de la suppression');
            this.cdr.markForCheck();
          },
        });
    }
  }

  deactivateProduct(sku: string): void {
    this.productService
      .deactivateProduct(sku)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Produit désactivé avec succès');
          this.loadProducts();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors de la désactivation');
          this.cdr.markForCheck();
        },
      });
  }
}

