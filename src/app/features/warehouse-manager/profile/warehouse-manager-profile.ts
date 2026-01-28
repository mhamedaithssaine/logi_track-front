import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import {
  WarehouseManagerResponseDto,
  WarehouseManagerUpdateDto,
} from '../../../core/models/warehouse-manager.models';
import { WarehouseResponseDto } from '../../../core/models/warehouse.models';
import { toast } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-manager-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './warehouse-manager-profile.html',
  styleUrl: './warehouse-manager-profile.scss',
})
export class WarehouseManagerProfile implements OnInit {
  private auth = inject(AuthService);
  private wmService = inject(WarehouseManagerApiService);
  private warehouseService = inject(WarehouseApiService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  profile: WarehouseManagerResponseDto | null = null;
  warehouses: WarehouseResponseDto[] = [];
  isLoading = false;
  loadError: string | null = null;
  isEditing = false;
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]],
      warehouseId: [null as number | null],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadWarehouses();
  }

  loadProfile(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecté.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    const done = (data: WarehouseManagerResponseDto) => {
      this.profile = data;
      this.loadError = null;
      this.isLoading = false;
      this.profileForm.patchValue({
        name: data.name,
        phone: data.phone ?? '',
        warehouseId: data.warehouseId ?? null,
      });
      this.cdr.detectChanges();
    };

    const fail = (err: unknown) => {
      const msg = (err as { message?: string; error?: { message?: string } })?.message
        || (err as { error?: { message?: string } })?.error?.message
        || 'Impossible de charger le profil.';
      this.loadError = msg;
      this.isLoading = false;
      toast.error(msg);
      this.cdr.detectChanges();
    };

    this.wmService.getById(user.id).subscribe({
      next: done,
      error: () => {
        this.wmService.getByEmail(user.email).subscribe({
          next: done,
          error: fail,
        });
      },
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (list) => (this.warehouses = list),
      error: () => {},
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.profile) {
      this.profileForm.patchValue({
        name: this.profile.name,
        phone: this.profile.phone ?? '',
        warehouseId: this.profile.warehouseId ?? null,
      });
    }
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.profile) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    const v = this.profileForm.value;
    const dto: WarehouseManagerUpdateDto = {
      name: v.name,
      phone: v.phone || undefined,
      warehouseId: v.warehouseId ?? undefined,
    };

    this.wmService
      .update(this.profile.id, dto)
      .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (updated) => {
          this.profile = updated;
          this.isEditing = false;
          toast.success('Profil mis à jour.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          toast.error(err?.message || 'Erreur lors de la mise à jour du profil.');
          this.cdr.detectChanges();
        },
      });
  }
}
