import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  InboundCreateDto,
  InboundResponseDto,
  OutboundCreateDto,
  OutboundResponseDto,
  AdjustmentCreateDto,
  AdjustmentResponseDto,
} from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/inventory`;

  recordInbound(dto: InboundCreateDto): Observable<InboundResponseDto> {
    return this.http.post<InboundResponseDto>(`${this.baseUrl}/inbound`, dto);
  }

  recordOutbound(dto: OutboundCreateDto): Observable<OutboundResponseDto> {
    return this.http.post<OutboundResponseDto>(`${this.baseUrl}/outbound`, dto);
  }

  recordAdjustment(dto: AdjustmentCreateDto): Observable<AdjustmentResponseDto> {
    return this.http.post<AdjustmentResponseDto>(`${this.baseUrl}/adjustment`, dto);
  }
}
