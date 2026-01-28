import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WarehouseApiService } from '../../../../core/api/warehouse-api.service';
import { WarehouseCreateDto, WarehouseUpdateDto } from '../../../../core/models/warehouse.models';
import { toast } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-warehouse-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.scss',
})
export class WarehouseForm implements OnInit {
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get basePath(): string {
    return this.router.url.startsWith('/warehouse') ? '/warehouse' : '/admin';
  }

  warehouseForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  code: string | null = null;

  constructor() {
    this.warehouseForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code');
    this.isEditMode = !!this.code;

    if (this.isEditMode && this.code) {
      this.loadWarehouse();
      this.warehouseForm.get('code')?.disable();
    }
  }

  loadWarehouse(): void {
    if (!this.code) return;

    this.isLoading = true;
    this.warehouseService.getWarehouseByCode(this.code).subscribe({
      next: (warehouse) => {
        this.warehouseForm.patchValue({
          code: warehouse.code,
          name: warehouse.name,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        toast.error(error.message || 'Erreur lors du chargement de l\'entrepôt');
      },
    });
  }

  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      Object.keys(this.warehouseForm.controls).forEach((key) => {
        this.warehouseForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.warehouseForm.getRawValue();

    if (this.isEditMode && this.code) {
      // Mode édition
      const updateDto: WarehouseUpdateDto = {
        name: formValue.name,
      };

      this.warehouseService.updateWarehouse(this.code, updateDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Entrepôt mis à jour avec succès');
          this.router.navigate([this.basePath + '/warehouses']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la mise à jour');
        },
      });
    } else {
      // Mode création
      const createDto: WarehouseCreateDto = {
        code: formValue.code,
        name: formValue.name,
      };

      this.warehouseService.createWarehouse(createDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Entrepôt créé avec succès');
          this.router.navigate([this.basePath + '/warehouses']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la création');
        },
      });
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.warehouseForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.warehouseForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    return '';
  }
}
