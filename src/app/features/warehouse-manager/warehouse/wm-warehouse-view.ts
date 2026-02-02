import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WarehouseApiService } from '../../../core/api/warehouse-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WarehouseResponseDto } from '../../../core/models/warehouse.models';

@Component({
  selector: 'app-wm-warehouse-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wm-warehouse-view.html',
  styleUrl: './wm-warehouse-view.scss',
})
export class WmWarehouseView implements OnInit {
  private warehouseApi = inject(WarehouseApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  warehouse: WarehouseResponseDto | null = null;
  isLoading = false;
  noWarehouse = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.noWarehouse = true;
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.noWarehouse = false;
    this.cdr.detectChanges();

    this.wmApi.getByEmail(user.email).subscribe({
      next: (wm) => {
        const myWarehouseId = wm.warehouseId ?? null;
        if (!myWarehouseId) {
          this.warehouse = null;
          this.noWarehouse = true;
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        this.warehouseApi.getAllWarehouses().subscribe({
          next: (list) => {
            const w = (list ?? []).find((x) => x.id === myWarehouseId) ?? null;
            this.warehouse = w;
            this.noWarehouse = !w;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.warehouse = null;
            this.noWarehouse = true;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.noWarehouse = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
