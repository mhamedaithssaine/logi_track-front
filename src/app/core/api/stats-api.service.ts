import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { AdminStatsDto, WarehouseStatsDto, ClientStatsDto } from '../models/stats.models';

@Injectable({ providedIn: 'root' })
export class StatsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/stats`;

  getAdminStats(): Observable<AdminStatsDto> {
    return this.http.get<AdminStatsDto>(`${this.baseUrl}/admin`);
  }

  getWarehouseStats(warehouseId?: number): Observable<WarehouseStatsDto> {
    let params = new HttpParams();
    if (warehouseId != null) params = params.set('warehouseId', warehouseId.toString());
    return this.http.get<WarehouseStatsDto>(`${this.baseUrl}/warehouse`, { params });
  }

  getClientStats(clientId?: number): Observable<ClientStatsDto> {
    let params = new HttpParams();
    if (clientId != null) params = params.set('clientId', clientId.toString());
    return this.http.get<ClientStatsDto>(`${this.baseUrl}/client`, { params });
  }
}
