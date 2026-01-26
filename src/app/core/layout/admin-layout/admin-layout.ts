import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  authService = inject(AuthService);

  constructor() {
    console.log('AdminLayout: Composant chargé');
    console.log('AdminLayout: Utilisateur =', this.authService.getCurrentUser());
    console.log('AdminLayout: Authentifié =', this.authService.isAuthenticated());
  }
}

