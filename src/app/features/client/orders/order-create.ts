import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderApiService } from '../../../core/api/order-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientCartService } from '../../../core/services/client-cart.service';
import { SalesOrderCreateDto, OrderLineDto } from '../../../core/models/order.models';
import { QuantitySelector } from '../../../shared/components/quantity-selector/quantity-selector';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, RouterLink, QuantitySelector],
  templateUrl: './order-create.html',
  styleUrl: './order-create.scss',
})
export class OrderCreate {
  private orderApi = inject(OrderApiService);
  private auth = inject(AuthService);
  private cartService = inject(ClientCartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  submitLoading = false;

  get cart() {
    return this.cartService.getItems();
  }

  setQty(sku: string, qty: number): void {
    this.cartService.set(sku, qty);
    this.cdr.detectChanges();
  }

  removeFromCart(sku: string): void {
    this.cartService.remove(sku);
    this.cdr.detectChanges();
  }

  submit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) { toast.error('Non connecte.'); return; }
    const items = this.cartService.getItems();
    if (items.length === 0) { toast.error('Panier vide.'); return; }
    const invalid = items.some(x => x.qty < 1 || !x.active);
    if (invalid) { toast.error('Qte > 0 et produits actifs uniquement.'); return; }

    const lines: OrderLineDto[] = items.map(x => ({
      sku: String(x.sku).trim(),
      quantity: Math.max(1, Math.floor(Number(x.qty) || 1)),
    }));
    const dto: SalesOrderCreateDto = {
      clientId: Number(user.id),
      lines,
    };
    this.submitLoading = true;
    this.cdr.detectChanges();

    this.orderApi.create(dto).subscribe({
      next: () => {
        this.submitLoading = false;
        this.cartService.clear();
        toast.success('Commande créée.');
        this.router.navigate(['/client/orders']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submitLoading = false;
        const body = err?.error;
        let msg = body?.message || err?.message || 'Erreur création commande.';
        if (body?.details && typeof body.details === 'object') {
          const details = Object.entries(body.details) as [string, string][];
          const first = details.map(([, v]) => v).find(Boolean);
          if (first) msg = first;
        }
        toast.error(msg);
        this.cdr.detectChanges();
      },
    });
  }
}
