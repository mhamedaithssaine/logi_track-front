import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApiService } from '../../../core/api/product-api.service';
import { ProductResponseDto } from '../../../core/models/product.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-catalogue-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogue-detail.html',
  styleUrl: './catalogue-detail.scss',
})
export class CatalogueDetail implements OnInit {
  private productApi = inject(ProductApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  product: ProductResponseDto | null = null;
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    const sku = this.route.snapshot.paramMap.get('sku');
    if (sku) this.load(sku);
  }

  load(sku: string): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.productApi.getProductBySku(sku).subscribe({
      next: (p) => {
        this.product = p;
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Produit introuvable.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }
}
