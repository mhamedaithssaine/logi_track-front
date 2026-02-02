import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsApiService } from '../../../core/api/stats-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { toast } from '../../../shared/services/toast.service';

const STATUSES = ['CREATED', 'RESERVED', 'PARTIAL_RESERVED', 'SHIPPED', 'DELIVERED', 'CANCELED'] as const;

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss',
})
export class ClientDashboard implements OnInit {
  private statsApi = inject(StatsApiService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  counts: Record<string, number> = {};
  shipmentsCount = 0;
  isLoading = false;
  loadError: string | null = null;
  ttlAlert: string | null = null;
  cutoffAlert: string | null = null;

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [{ data: [], backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true, maintainAspectRatio: false };

  ngOnInit(): void {
    this.loadKpis();
    this.setAlerts();
  }

  loadKpis(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loadError = 'Non connecté.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.loadError = null;
    this.cdr.detectChanges();

    this.statsApi.getClientStats(user.id).subscribe({
      next: (stats) => {
        const map: Record<string, number> = {};
        STATUSES.forEach((s) => (map[s] = 0));
        const byStatus = stats.ordersByStatus ?? {};
        Object.keys(byStatus).forEach((k) => {
          const up = k.toUpperCase();
          if (STATUSES.includes(up as (typeof STATUSES)[number])) map[up] = byStatus[k];
        });
        this.counts = map;
        this.shipmentsCount = stats.shipmentsCount ?? 0;
        const labels = Object.keys(this.counts).filter((k) => this.counts[k] > 0);
        const values = labels.map((k) => this.counts[k]);
        this.doughnutChartData = {
          labels,
          datasets: [{ data: values, backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }],
        };
        this.loadError = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.message || err?.error?.message || 'Erreur chargement KPIs.';
        this.isLoading = false;
        toast.error(this.loadError ?? 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }

  setAlerts(): void {
    const h = new Date().getHours();
    if (h >= 15) this.cutoffAlert = 'Cut-off 15h dépassé. Les commandes créées maintenant seront planifiées pour le prochain jour.';
    else this.cutoffAlert = 'Cut-off 15h : commandez avant 15h pour une expédition planifiée aujourd\'hui.';
    this.ttlAlert = 'Réservation : pensez à confirmer vos réservations (TTL variable selon configuration).';
    this.cdr.detectChanges();
  }
}
