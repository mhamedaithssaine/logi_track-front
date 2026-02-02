import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  PurchaseOrderCreateDto,
  PurchaseOrderReceiveDto,
  PurchaseOrderResponseDto,
  PurchaseOrderCancelResponseDto,
} from '../models/purchase.models';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/purchase-orders`;

  getAll(): Observable<PurchaseOrderResponseDto[]> {
    return this.http.get<PurchaseOrderResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<PurchaseOrderResponseDto> {
    return this.http.get<PurchaseOrderResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: PurchaseOrderCreateDto): Observable<PurchaseOrderResponseDto> {
    return this.http.post<PurchaseOrderResponseDto>(this.baseUrl, dto);
  }

  receive(id: number, dto: PurchaseOrderReceiveDto): Observable<PurchaseOrderResponseDto> {
    return this.http.post<PurchaseOrderResponseDto>(`${this.baseUrl}/${id}/receive`, dto);
  }

  cancel(id: number): Observable<PurchaseOrderCancelResponseDto> {
    return this.http.post<PurchaseOrderCancelResponseDto>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
