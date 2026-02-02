import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderApiService } from '../../../core/api/order-api.service';
import { SalesOrderResponseDto, SalesOrderReserveResponseDto } from '../../../core/models/order.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit {
  private orderApi = inject(OrderApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  order: SalesOrderResponseDto | null = null;
  isLoading = false;
  loadError: string | null = null;
  reserveLoading = false;
  cancelLoading = false;

  /** Annulation côté client : uniquement statut CREATED (les autres renvoient une exception backend). */
  readonly cancelableStatuses = ['CREATED'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(Number(id));
  }

  load(id: number): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();
    this.orderApi.getById(id).subscribe({
      next: (o) => {
        this.order = o;
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Commande introuvable.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  reserve(): void {
    if (!this.order || this.reserveLoading) return;
    if (this.order.status !== 'CREATED') {
      toast.error('Seules les commandes CREATED peuvent etre reservees.');
      return;
    }
    this.reserveLoading = true;
    this.cdr.detectChanges();
    this.orderApi.reserve(this.order.id).subscribe({
      next: (res: SalesOrderReserveResponseDto) => {
        this.reserveLoading = false;
        toast.success(res.message || 'Reservation OK.');
        this.load(this.order!.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.reserveLoading = false;
        toast.error(err?.message || err?.error?.message || 'Erreur reservation.');
        this.cdr.detectChanges();
      },
    });
  }

  canCancel(): boolean {
    return !!this.order && this.cancelableStatuses.includes(this.order.status) && !this.cancelLoading;
  }

  cancel(): void {
    if (!this.order || !this.canCancel()) return;
    if (!confirm('Annuler cette commande ?')) return;
    this.cancelLoading = true;
    this.cdr.detectChanges();
    this.orderApi.cancel(this.order.id).subscribe({
      next: () => {
        toast.success('Commande annulée.');
        this.cancelLoading = false;
        this.load(this.order!.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur annulation.');
        this.cancelLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
