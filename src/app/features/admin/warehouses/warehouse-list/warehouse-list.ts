import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WarehouseApiService } from '../../../../core/api/warehouse-api.service';
import { WarehouseResponseDto } from '../../../../core/models/warehouse.models';
import { toast } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.scss',
})
export class WarehouseList implements OnInit {
  private warehouseService = inject(WarehouseApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  get basePath(): string {
    return this.router.url.startsWith('/warehouse') ? '/warehouse' : '/admin';
  }

  warehouses: WarehouseResponseDto[] = [];
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.warehouseService
      .getAllWarehouses()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (warehouses) => {
          this.warehouses = warehouses;
          this.loadError = null;
          this.cdr.markForCheck();
        },
        error: (err) => {
          const msg = err?.message || err?.error?.message || 'Erreur lors du chargement des entrepôts.';
          this.loadError = msg;
          toast.error(msg);
          this.cdr.markForCheck();
        },
      });
  }

  deleteWarehouse(code: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) return;
    this.warehouseService
      .deleteWarehouse(code)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Entrepôt supprimé avec succès');
          this.loadWarehouses();
        },
        error: (err) => {
          toast.error(err?.message || 'Erreur lors de la suppression');
          this.cdr.markForCheck();
        },
      });
  }
}
