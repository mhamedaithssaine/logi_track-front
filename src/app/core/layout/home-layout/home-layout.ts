import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ClientCartService } from '../../services/client-cart.service';
import { CartSidebar } from '../../../shared/components/cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CartSidebar],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.scss',
})
export class HomeLayout {
  authService = inject(AuthService);
  cartService = inject(ClientCartService);

  cartOpen = signal(false);
  userMenuOpen = signal(false);

  openCart(): void {
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.authService.logout();
  }

  isClient(): boolean {
    return this.authService.hasRole('CLIENT');
  }
}
