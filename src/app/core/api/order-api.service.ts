import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  SalesOrderCreateDto,
  SalesOrderResponseDto,
  SalesOrderReserveDto,
  SalesOrderReserveResponseDto,
  Page,
} from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/orders`;

  create(dto: SalesOrderCreateDto): Observable<SalesOrderResponseDto> {
    return this.http.post<SalesOrderResponseDto>(this.baseUrl, dto);
  }

  getById(id: number): Observable<SalesOrderResponseDto> {
    return this.http.get<SalesOrderResponseDto>(`${this.baseUrl}/${id}`);
  }

  list(params: {
    clientId?: number;
    warehouseId?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    size?: number;
  }): Observable<Page<SalesOrderResponseDto>> {
    let httpParams = new HttpParams();
    if (params.clientId != null) httpParams = httpParams.set('clientId', params.clientId.toString());
    if (params.warehouseId != null) httpParams = httpParams.set('warehouseId', params.warehouseId.toString());
    if (params.status != null) httpParams = httpParams.set('status', params.status);
    if (params.dateFrom != null) httpParams = httpParams.set('dateFrom', params.dateFrom);
    if (params.dateTo != null) httpParams = httpParams.set('dateTo', params.dateTo);
    if (params.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params.size != null) httpParams = httpParams.set('size', params.size.toString());
    return this.http.get<Page<SalesOrderResponseDto>>(this.baseUrl, { params: httpParams });
  }

  reserve(orderId: number, dto?: SalesOrderReserveDto): Observable<SalesOrderReserveResponseDto> {
    const body = dto ?? { orderId };
    return this.http.post<SalesOrderReserveResponseDto>(`${this.baseUrl}/${orderId}/reserve`, body);
  }

  cancel(orderId: number, cancelReason?: string): Observable<unknown> {
    const body = { orderId, ...(cancelReason != null && cancelReason !== '' ? { cancelReason } : {}) };
    return this.http.post<unknown>(`${this.baseUrl}/${orderId}/cancel`, body);
  }

  confirm(orderId: number): Observable<SalesOrderResponseDto> {
    return this.http.patch<SalesOrderResponseDto>(`${this.baseUrl}/${orderId}/confirm`, {});
  }

  assignWarehouse(orderId: number, warehouseId: number): Observable<SalesOrderResponseDto> {
    return this.http.patch<SalesOrderResponseDto>(`${this.baseUrl}/${orderId}/assign-warehouse`, { warehouseId });
  }
}
