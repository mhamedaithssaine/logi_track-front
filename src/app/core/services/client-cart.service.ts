import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  sku: string;
  name: string;
  qty: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientCartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((s, i) => s + i.qty, 0));
  readonly size = computed(() => this.items().length);

  add(sku: string, name: string, qty: number, active: boolean): void {
    if (qty < 1) return;
    const list = [...this.items()];
    const i = list.findIndex((x) => x.sku === sku);
    if (i >= 0) list[i] = { ...list[i], qty: list[i].qty + qty };
    else list.push({ sku, name, qty, active });
    this.items.set(list);
  }

  remove(sku: string): void {
    this.items.set(this.items().filter((x) => x.sku !== sku));
  }

  set(sku: string, qty: number): void {
    if (qty < 1) {
      this.remove(sku);
      return;
    }
    const list = this.items().map((x) =>
      x.sku === sku ? { ...x, qty } : x
    );
    this.items.set(list);
  }

  getItems(): CartItem[] {
    return [...this.items()];
  }

  clear(): void {
    this.items.set([]);
  }
}
