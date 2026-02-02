import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StatsApiService } from '../../../core/api/stats-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private statsApi = inject(StatsApiService);
  private cdr = inject(ChangeDetectorRef);

  productsCount = 0;
  suppliersCount = 0;
  warehousesCount = 0;
  ordersCount = 0;
  shipmentsCount = 0;
  purchaseOrdersCount = 0;
  ordersByStatus: Record<string, number> = {};
  isLoading = false;
  loadError: string | null = null;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Produits', 'Fournisseurs', 'Entrepôts', 'Commandes'],
    datasets: [{ data: [0, 0, 0, 0], label: 'Nombre', backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B'] }],
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }],
  };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true, maintainAspectRatio: false };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();
    this.statsApi.getAdminStats().subscribe({
      next: (stats) => {
        this.productsCount = stats.productsCount;
        this.suppliersCount = stats.suppliersCount;
        this.warehousesCount = stats.warehousesCount;
        this.ordersCount = stats.ordersCount;
        this.shipmentsCount = stats.shipmentsCount;
        this.purchaseOrdersCount = stats.purchaseOrdersCount ?? 0;
        this.ordersByStatus = stats.ordersByStatus ?? {};
        this.barChartData = {
          ...this.barChartData,
          datasets: [{ ...this.barChartData.datasets[0], data: [stats.productsCount, stats.suppliersCount, stats.warehousesCount, stats.ordersCount] }],
        };
        const labels = Object.keys(this.ordersByStatus);
        const values = labels.map((k) => this.ordersByStatus[k]);
        this.doughnutChartData = {
          labels,
          datasets: [{ data: values, backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }],
        };
        this.isLoading = false;
        this.loadError = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement statistiques.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
