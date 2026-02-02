import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { CartItem } from '../../../core/services/client-cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-overlay" [class.cart-overlay--open]="open()" (click)="close.emit()" role="button" tabindex="0" (keydown.escape)="close.emit()"></div>
    <aside class="cart-sidebar" [class.cart-sidebar--open]="open()">
      <div class="cart-sidebar__header">
        <h2 class="cart-sidebar__title">Panier</h2>
        <button type="button" class="cart-sidebar__close" (click)="close.emit()" aria-label="Fermer">×</button>
      </div>
      @if (items().length === 0) {
        <div class="cart-sidebar__empty">
          <p>Votre panier est vide.</p>
          <p class="cart-sidebar__empty-hint">Ajoutez des produits depuis le catalogue.</p>
        </div>
      } @else {
        <ul class="cart-sidebar__list">
          @for (item of items(); track item.sku) {
            <li class="cart-sidebar__item">
              <div class="cart-sidebar__item-info">
                <span class="cart-sidebar__item-name">{{ item.name }}</span>
                <span class="cart-sidebar__item-sku">SKU {{ item.sku }}</span>
              </div>
              <div class="cart-sidebar__item-meta">
                <span class="cart-sidebar__item-qty">× {{ item.qty }}</span>
                <button type="button" class="cart-sidebar__item-remove" (click)="remove.emit(item.sku)" aria-label="Retirer">Retirer</button>
              </div>
            </li>
          }
        </ul>
        <div class="cart-sidebar__footer">
          <p class="cart-sidebar__total">{{ items().length }} article(s)</p>
          <a routerLink="/client/orders/new" class="cart-sidebar__btn-checkout" (click)="close.emit()">
            Valider la commande
          </a>
        </div>
      }
    </aside>
  `,
  styles: [`
    .cart-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-normal), visibility var(--transition-normal);
      z-index: 40;
    }
    .cart-overlay--open {
      opacity: 1;
      visibility: visible;
    }
    .cart-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 400px;
      height: 100%;
      background: var(--color-bg-elevated);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
      z-index: 50;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform var(--transition-normal);
    }
    .cart-sidebar--open {
      transform: translateX(0);
    }
    .cart-sidebar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--color-border);
    }
    .cart-sidebar__title {
      margin: 0;
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--color-text);
    }
    .cart-sidebar__close {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--color-text-secondary);
      background: none;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
    }
    .cart-sidebar__close:hover {
      background: var(--color-bg-muted);
      color: var(--color-text);
    }
    .cart-sidebar__empty {
      padding: var(--space-8);
      text-align: center;
      color: var(--color-text-secondary);
    }
    .cart-sidebar__empty-hint {
      margin-top: var(--space-2);
      font-size: var(--text-sm);
    }
    .cart-sidebar__list {
      list-style: none;
      margin: 0;
      padding: var(--space-4);
      overflow-y: auto;
      flex: 1;
    }
    .cart-sidebar__item {
      padding: var(--space-3) 0;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-3);
    }
    .cart-sidebar__item-info {
      flex: 1;
      min-width: 0;
    }
    .cart-sidebar__item-name {
      display: block;
      font-weight: var(--font-medium);
      color: var(--color-text);
    }
    .cart-sidebar__item-sku {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }
    .cart-sidebar__item-meta {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-1);
    }
    .cart-sidebar__item-qty {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .cart-sidebar__item-remove {
      font-size: var(--text-xs);
      color: var(--color-primary);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .cart-sidebar__item-remove:hover {
      text-decoration: underline;
    }
    .cart-sidebar__footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-border);
    }
    .cart-sidebar__total {
      margin: 0 0 var(--space-3);
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .cart-sidebar__btn-checkout {
      display: block;
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      text-align: center;
      color: white;
      background: var(--color-primary);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background var(--transition-fast);
    }
    .cart-sidebar__btn-checkout:hover {
      background: var(--color-primary-hover);
    }
  `],
})
export class CartSidebar {
  open = input(false);
  items = input<CartItem[]>([]);

  close = output<void>();
  remove = output<string>();
}
