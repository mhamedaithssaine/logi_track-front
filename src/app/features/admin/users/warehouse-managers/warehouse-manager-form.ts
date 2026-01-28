import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WarehouseManagerApiService } from '../../../../core/api/warehouse-manager-api.service';
import { WarehouseApiService } from '../../../../core/api/warehouse-api.service';
import {
  WarehouseManagerCreateDto,
  WarehouseManagerUpdateDto,
  WarehouseManagerResponseDto,
} from '../../../../core/models/warehouse-manager.models';
import { WarehouseResponseDto } from '../../../../core/models/warehouse.models';
import { toast } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-warehouse-manager-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './warehouse-manager-form.html',
  styleUrl: './warehouse-manager-form.scss',
})
export class WarehouseManagerForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(WarehouseManagerApiService);
  private warehouseService = inject(WarehouseApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  id: number | null = null;
  warehouses: WarehouseResponseDto[] = [];
  existing: WarehouseManagerResponseDto | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      warehouseId: [null, [Validators.required]],
      password: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.isEditMode = !!this.id;

    this.loadWarehouses();

    if (this.isEditMode && this.id) {
      this.loadManager();
      // en édition, mot de passe optionnel
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      // en création, mot de passe requis
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  loadWarehouses(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (data) => (this.warehouses = data),
      error: (error) => {
        console.error('Erreur lors du chargement des entrepôts:', error);
      },
    });
  }

  loadManager(): void {
    if (!this.id) return;
    this.isLoading = true;
    this.service.getById(this.id).subscribe({
      next: (m) => {
        this.existing = m;
        this.form.patchValue({
          name: m.name,
          email: m.email,
          phone: m.phone || '',
          warehouseId: m.warehouseId || null,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        toast.error(error.message || 'Erreur lors du chargement du Warehouse Manager');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const value = this.form.getRawValue();

    if (this.isEditMode && this.id) {
      const dto: WarehouseManagerUpdateDto = {
        name: value.name,
        phone: value.phone || undefined,
        warehouseId: value.warehouseId,
      };

      this.service.update(this.id, dto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Warehouse Manager mis à jour avec succès');
          this.router.navigate(['/admin/users/warehouse-managers']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la mise à jour');
        },
      });
    } else {
      const dto: WarehouseManagerCreateDto = {
        name: value.name,
        email: value.email,
        phone: value.phone || undefined,
        password: value.password,
        warehouseId: value.warehouseId,
      };

      this.service.create(dto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Warehouse Manager créé avec succès');
          this.router.navigate(['/admin/users/warehouse-managers']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la création');
        },
      });
    }
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (c?.hasError('required')) return 'Ce champ est obligatoire';
    if (c?.hasError('email')) return 'Email invalide';
    if (c?.hasError('minlength')) return 'Minimum 6 caractères';
    return '';
  }
}

