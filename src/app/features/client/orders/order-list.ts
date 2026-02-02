import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderApiService } from '../../../core/api/order-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SalesOrderResponseDto } from '../../../core/models/order.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private orderApi = inject(OrderApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  orders: SalesOrderResponseDto[] = [];
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;
  statusFilter = '';
  isLoading = false;
  loadError: string | null = null;
  cancelingId: number | null = null;

  /** Annulation côté client : uniquement statut CREATED (les autres renvoient une exception backend). */
  readonly cancelableStatuses = ['CREATED'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecté.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.orderApi
      .list({
        clientId: user.id,
        status: this.statusFilter || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (p) => {
          this.orders = p.content;
          this.totalElements = p.totalElements;
          this.totalPages = p.totalPages;
          this.loadError = null;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loadError = err?.message || err?.error?.message || 'Erreur chargement commandes.';
          this.isLoading = false;
          toast.error(this.loadError ?? 'Erreur');
          this.cdr.detectChanges();
        },
      });
  }

  applyFilters(): void {
    this.page = 0;
    this.load();
  }

  goPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.load();
  }

  canCancel(o: SalesOrderResponseDto): boolean {
    return this.cancelableStatuses.includes(o.status) && this.cancelingId !== o.id;
  }

  cancel(id: number): void {
    if (!confirm('Annuler cette commande ?')) return;
    this.cancelingId = id;
    this.cdr.detectChanges();
    this.orderApi.cancel(id).subscribe({
      next: () => {
        toast.success('Commande annulée.');
        this.cancelingId = null;
        this.load();
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur annulation.');
        this.cancelingId = null;
        this.cdr.detectChanges();
      },
    });
  }
}
