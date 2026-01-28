import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientApiService } from '../../../../core/api/client-api.service';
import { ClientResponseDto } from '../../../../core/models/client.models';
import { toast } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  private service = inject(ClientApiService);
  private cdr = inject(ChangeDetectorRef);

  clients: ClientResponseDto[] = [];
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
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
          this.clients = Array.isArray(data) ? data : [];
          this.loadError = null;
          this.cdr.markForCheck();
        },
        error: (err) => {
          const msg = err?.message || err?.error?.message || 'Erreur lors du chargement des clients.';
          this.loadError = msg;
          toast.error(msg);
          this.cdr.markForCheck();
        },
      });
  }

  deactivate(id: number): void {
    if (!confirm('Désactiver ce client ?')) return;
    this.service
      .deactivate(id)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Client désactivé');
          this.loadClients();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors de la désactivation');
        },
      });
  }

  activate(id: number): void {
    if (!confirm('Activer ce client ?')) return;
    this.service
      .activate(id)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Client activé');
          this.loadClients();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors de l\'activation');
        },
      });
  }

  delete(id: number): void {
    if (!confirm('Supprimer ce client ?')) return;
    this.service
      .delete(id)
      .pipe(finalize(() => this.cdr.markForCheck()))
      .subscribe({
        next: () => {
          toast.success('Client supprimé');
          this.loadClients();
        },
        error: (error) => {
          toast.error(error.message || 'Erreur lors de la suppression');
        },
      });
  }
}

