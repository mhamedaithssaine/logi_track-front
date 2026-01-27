import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupplierApiService } from '../../../../core/api/supplier-api.service';
import { SupplierResponseDto } from '../../../../core/models/supplier.models';
import { toast } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
})
export class SupplierList implements OnInit {
  private supplierService = inject(SupplierApiService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: SupplierResponseDto[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.supplierService
      .getAllSuppliers()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.cdr.markForCheck();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors du chargement des fournisseurs');
          this.cdr.markForCheck();
        },
      });
  }

  deleteSupplier(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.supplierService
        .deleteSupplier(id)
        .pipe(finalize(() => this.cdr.markForCheck()))
        .subscribe({
          next: () => {
            toast.success('Fournisseur supprimé avec succès');
            this.loadSuppliers();
          },
          error: (error) => {
            toast.error(error.message || 'Erreur lors de la suppression');
            this.cdr.markForCheck();
          },
        });
    }
  }
}
