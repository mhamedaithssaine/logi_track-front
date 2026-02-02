import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StatsApiService } from '../../../core/api/stats-api.service';
import { WarehouseManagerApiService } from '../../../core/api/warehouse-manager-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { toast } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-warehouse-manager-dashboard',
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './warehouse-manager-dashboard.html',
  styleUrl: './warehouse-manager-dashboard.scss',
})
export class WarehouseManagerDashboard implements OnInit {
  private statsApi = inject(StatsApiService);
  private wmApi = inject(WarehouseManagerApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  productsCount = 0;
  suppliersCount = 0;
  warehousesCount = 0;
  ordersToReserveCount = 0;
  shipmentsPlannedCount = 0;
  ordersByStatus: Record<string, number> = {};
  isLoading = false;
  loadError: string | null = null;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Produits', 'Fournisseurs', 'Entrepôts', 'À réserver'],
    datasets: [{ data: [0, 0, 0, 0], label: 'Nombre', backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B'] }],
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [{ data: [], backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'] }] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true, maintainAspectRatio: false };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecté.';
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.wmApi.getByEmail(user.email).pipe(
      switchMap((wm) => this.statsApi.getWarehouseStats(wm?.warehouseId ?? undefined)),
    ).subscribe({
      next: (stats) => {
        this.productsCount = stats.productsCount;
        this.suppliersCount = stats.suppliersCount;
        this.warehousesCount = stats.warehousesCount;
        this.ordersToReserveCount = stats.ordersToReserveCount ?? 0;
        this.shipmentsPlannedCount = stats.shipmentsPlannedCount ?? 0;
        this.ordersByStatus = stats.ordersByStatus ?? {};
        this.barChartData = {
          ...this.barChartData,
          datasets: [{ ...this.barChartData.datasets[0], data: [stats.productsCount, stats.suppliersCount, stats.warehousesCount, stats.ordersToReserveCount] }],
        };
        const labels = Object.keys(this.ordersByStatus);
        const values = labels.map((k) => this.ordersByStatus[k]);
        this.doughnutChartData = { labels, datasets: [{ data: values, backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'] }] };
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement tableau de bord.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }
}
