import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShipmentApiService } from '../../../core/api/shipment-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ShipmentFullResponseDto } from '../../../core/models/shipment.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.scss',
})
export class ShipmentList implements OnInit {
  private shipmentApi = inject(ShipmentApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  shipments: ShipmentFullResponseDto[] = [];
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecte.';
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.shipmentApi.listByClientId(user.id).subscribe({
      next: (list) => {
        this.shipments = list;
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement expeditions.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }
}
