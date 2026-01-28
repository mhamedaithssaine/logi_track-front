import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WarehouseManagerApiService } from '../../../../core/api/warehouse-manager-api.service';
import { WarehouseManagerResponseDto } from '../../../../core/models/warehouse-manager.models';
import { toast } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-warehouse-manager-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-manager-list.html',
  styleUrl: './warehouse-manager-list.scss',
})
export class WarehouseManagerList implements OnInit {
  private service = inject(WarehouseManagerApiService);
  private cdr = inject(ChangeDetectorRef);

  managers: WarehouseManagerResponseDto[] = [];
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.service
      .getAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.managers = Array.isArray(data) ? data : [];
          this.loadError = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          const msg = err?.message || err?.error?.message || "Erreur lors du chargement des responsables d'entrepôt";
          this.loadError = msg;
          toast.error(msg);
          this.cdr.detectChanges();
        },
      });
  }

  deactivate(id: number): void {
    if (!confirm("Désactiver ce responsable d'entrepôt ?")) return;
    this.service
      .deactivate(id)
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: () => {
          toast.success('Responsable désactivé');
          this.loadManagers();
        },
        error: (err) => {
          toast.error(err?.message || 'Erreur lors de la désactivation');
          this.cdr.detectChanges();
        },
      });
  }

  activate(id: number): void {
    if (!confirm("Activer ce responsable d'entrepôt ?")) return;
    this.service
      .activate(id)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Responsable activé');
          this.loadManagers();
        },
        error: (error) => {
          toast.error(error.message || "Erreur lors de l'activation");
        },
      });
  }

  delete(id: number): void {
    if (!confirm("Supprimer ce responsable d'entrepôt ?")) return;
    this.service
      .delete(id)
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: () => {
          toast.success('Responsable supprimé');
          this.loadManagers();
        },
        error: (err) => {
          toast.error(err?.message || 'Erreur lors de la suppression');
          this.cdr.detectChanges();
        },
      });
  }
}
