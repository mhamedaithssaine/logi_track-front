import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../../../core/api/product-api.service';
import { ProductCreateDto, ProductUpdateDto } from '../../../../core/models/product.models';
import { toast } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get basePath(): string {
    return this.router.url.startsWith('/warehouse') ? '/warehouse' : '/admin';
  }

  productForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  sku: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      active: [true],
    });
  }

  ngOnInit(): void {
    this.sku = this.route.snapshot.paramMap.get('sku');
    this.isEditMode = !!this.sku;

    if (this.isEditMode && this.sku) {
      this.loadProduct();
      this.productForm.get('sku')?.disable();
    }
  }

  loadProduct(): void {
    if (!this.sku) return;

    this.isLoading = true;
    this.productService.getProductBySku(this.sku).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: product.price,
          active: product.active,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        toast.error(error.message || 'Erreur lors du chargement du produit');
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach((key) => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.productForm.getRawValue();

    if (this.isEditMode && this.sku) {
      // Mode édition
      const updateDto: ProductUpdateDto = {
        name: formValue.name,
        category: formValue.category,
        price: formValue.price,
        active: formValue.active,
      };

      this.productService.updateProduct(this.sku, updateDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Produit mis à jour avec succès');
          this.router.navigate([this.basePath + '/products']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la mise à jour');
        },
      });
    } else {
      // Mode création
      const createDto: ProductCreateDto = {
        sku: formValue.sku,
        name: formValue.name,
        category: formValue.category,
        price: formValue.price,
        active: formValue.active ?? true,
      };

      this.productService.createProduct(createDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Produit créé avec succès');
          this.router.navigate([this.basePath + '/products']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la création');
        },
      });
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('min')) {
      return 'Le prix doit être supérieur ou égal à 0';
    }
    return '';
  }
}

