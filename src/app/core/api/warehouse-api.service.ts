import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { WarehouseCreateDto, WarehouseUpdateDto, WarehouseResponseDto } from '../models/warehouse.models';

@Injectable({
  providedIn: 'root',
})
export class WarehouseApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/warehouses`;

/**
   * Créer un nouvel entrepôt
   */
  createWarehouse(dto: WarehouseCreateDto): Observable<WarehouseResponseDto> {
    return this.http.post<WarehouseResponseDto>(this.baseUrl, dto);
  }

  /**
   * Récupérer tous les entrepôts
   */
  getAllWarehouses(): Observable<WarehouseResponseDto[]> {
    return this.http.get<WarehouseResponseDto[]>(this.baseUrl);
  }

  /**
   * Récupérer un entrepôt par code
   */
  getWarehouseByCode(code: string): Observable<WarehouseResponseDto> {
    return this.http.get<WarehouseResponseDto>(`${this.baseUrl}/${code}`);
  }

  /**
   * Mettre à jour un entrepôt
   */
  updateWarehouse(code: string, dto: WarehouseUpdateDto): Observable<WarehouseResponseDto> {
    return this.http.put<WarehouseResponseDto>(`${this.baseUrl}/${code}`, dto);
  }

  /**
   * Supprimer un entrepôt
   */
  deleteWarehouse(code: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${code}`, {
      responseType: 'text',
    }) as Observable<string>;
  }
}
