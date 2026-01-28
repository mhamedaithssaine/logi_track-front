import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-warehouse-manager-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './warehouse-manager-layout.html',
  styleUrl: './warehouse-manager-layout.scss',
})
export class WarehouseManagerLayout {
  authService = inject(AuthService);
}
