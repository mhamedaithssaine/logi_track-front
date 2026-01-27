import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierApiService } from '../../../../core/api/supplier-api.service';
import { WarehouseApiService } from '../../../../core/api/warehouse-api.service';
import { SupplierCreateDto, SupplierUpdateDto } from '../../../../core/models/supplier.models';
import { WarehouseResponseDto } from '../../../../core/models/warehouse.models';
import { toast } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehouseApiService  = inject(WarehouseApiService)
  
  

  supplierForm: FormGroup;
  warehouses: WarehouseResponseDto[] = [];
  isLoading = false;
  isEditMode = false;
  id: number | null = null;

  constructor() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      contact: [''],
      warehouseId: [null],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.isEditMode = !!this.id;

    this.loadWarehouses();

    if (this.isEditMode && this.id) {
      this.loadSupplier();
    }
  }

  loadWarehouses(): void {
    this.warehouseApiService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        console.log("warehouses", warehouses);
        this.warehouses = warehouses;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des entrepôts:', error);
      },
    });
  }

  loadSupplier(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.supplierService.getSupplierById(this.id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue({
          name: supplier.name,
          contact: supplier.contact || '',
          warehouseId: supplier.warehouseId || null,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        toast.error(error.message || 'Erreur lors du chargement du fournisseur');
      },
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      Object.keys(this.supplierForm.controls).forEach((key) => {
        this.supplierForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.supplierForm.getRawValue();

    if (this.isEditMode && this.id) {
      // Mode édition
      const updateDto: SupplierUpdateDto = {
        name: formValue.name,
        contact: formValue.contact || undefined,
        warehouseId: formValue.warehouseId || undefined,
      };

      this.supplierService.updateSupplier(this.id, updateDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Fournisseur mis à jour avec succès');
          this.router.navigate(['/admin/suppliers']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la mise à jour');
        },
      });
    } else {
      // Mode création
      const createDto: SupplierCreateDto = {
        name: formValue.name,
        contact: formValue.contact || undefined,
        warehouseId: formValue.warehouseId || undefined,
      };

      this.supplierService.createSupplier(createDto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Fournisseur créé avec succès');
          this.router.navigate(['/admin/suppliers']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la création');
        },
      });
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    return '';
  }
}
