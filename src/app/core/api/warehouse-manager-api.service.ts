import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  WarehouseManagerCreateDto,
  WarehouseManagerUpdateDto,
  WarehouseManagerResponseDto,
} from '../models/warehouse-manager.models';

@Injectable({
  providedIn: 'root',
})
export class WarehouseManagerApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/warehouse-managers`;

  /**
   * Créer un nouveau Warehouse Manager (register)
   */
  create(dto: WarehouseManagerCreateDto): Observable<WarehouseManagerResponseDto> {
    return this.http.post<WarehouseManagerResponseDto>(`${this.baseUrl}/register`, dto);
  }

  /**
   * Récupérer tous les Warehouse Managers
   * (on suppose un endpoint GET /api/warehouse-managers)
   */
  getAll(): Observable<WarehouseManagerResponseDto[]> {
    return this.http.get<WarehouseManagerResponseDto[]>(this.baseUrl);
  }

  /**
   * Récupérer par ID
   */
  getById(id: number): Observable<WarehouseManagerResponseDto> {
    return this.http.get<WarehouseManagerResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Récupérer par email
   */
  getByEmail(email: string): Observable<WarehouseManagerResponseDto> {
    return this.http.get<WarehouseManagerResponseDto>(
      `${this.baseUrl}/email/${encodeURIComponent(email)}`
    );
  }

  /**
   * Mettre à jour un Warehouse Manager
   */
  update(id: number, dto: WarehouseManagerUpdateDto): Observable<WarehouseManagerResponseDto> {
    return this.http.put<WarehouseManagerResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

 
  delete(id: number): Observable<WarehouseManagerResponseDto> {
    return this.http.delete<WarehouseManagerResponseDto>(`${this.baseUrl}/${id}/delete`);
  }

 
  deactivate(id: number): Observable<WarehouseManagerResponseDto> {
    return this.http.patch<WarehouseManagerResponseDto>(`${this.baseUrl}/${id}/deactivate`, {});
  }

 
  activate(id: number): Observable<WarehouseManagerResponseDto> {
    return this.http.patch<WarehouseManagerResponseDto>(`${this.baseUrl}/${id}/activate`, {});
  }
}

