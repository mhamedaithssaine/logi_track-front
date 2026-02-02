import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShipmentApiService } from '../../../core/api/shipment-api.service';
import { ShipmentFullResponseDto } from '../../../core/models/shipment.models';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shipment-detail.html',
  styleUrl: './shipment-detail.scss',
})
export class ShipmentDetail implements OnInit {
  private shipmentApi = inject(ShipmentApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  shipment: ShipmentFullResponseDto | null = null;
  isLoading = false;
  loadError: string | null = null;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) this.load(Number(orderId));
  }

  load(orderId: number): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();
    this.shipmentApi.getByOrderId(orderId).subscribe({
      next: (s) => {
        this.shipment = s;
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Expedition introuvable.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }
}
