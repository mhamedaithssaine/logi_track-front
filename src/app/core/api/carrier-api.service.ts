import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CarrierResponseDto, CarrierCreateDto, CarrierUpdateDto } from '../models/carrier.models';

@Injectable({ providedIn: 'root' })
export class CarrierApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/carriers`;

  list(activeOnly = true): Observable<CarrierResponseDto[]> {
    const params = new HttpParams().set('activeOnly', activeOnly.toString());
    return this.http.get<CarrierResponseDto[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<CarrierResponseDto> {
    return this.http.get<CarrierResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CarrierCreateDto): Observable<CarrierResponseDto> {
    return this.http.post<CarrierResponseDto>(this.baseUrl, dto);
  }

  update(id: number, dto: CarrierUpdateDto): Observable<CarrierResponseDto> {
    return this.http.put<CarrierResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
