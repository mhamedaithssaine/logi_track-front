import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  warehouses: WarehouseResponseDto[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.isLoading = true;
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors du chargement des entrepôts');
          this.cdr.markForCheck();
        },
      });
  }

  deleteWarehouse(code: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) {
      this.warehouseService
        .deleteWarehouse(code)
        .pipe(finalize(() => this.cdr.markForCheck()))
        .subscribe({
          next: () => {
            toast.success('Entrepôt supprimé avec succès');
            this.loadWarehouses();
          },
          error: (error) => {
            toast.error(error.message || 'Erreur lors de la suppression');
            this.cdr.markForCheck();
          },
        });
    }
  }
}
