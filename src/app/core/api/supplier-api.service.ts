import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { SupplierCreateDto, SupplierUpdateDto, SupplierResponseDto } from '../models/supplier.models';

@Injectable({
  providedIn: 'root',
})
export class SupplierApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/suppliers`;

  /**
   * Créer un nouveau fournisseur
   */
  createSupplier(dto: SupplierCreateDto): Observable<SupplierResponseDto> {
    return this.http.post<SupplierResponseDto>(this.baseUrl, dto);
  }

  /**
   * Récupérer tous les fournisseurs
   */
  getAllSuppliers(): Observable<SupplierResponseDto[]> {
    return this.http.get<SupplierResponseDto[]>(this.baseUrl);
  }

  /**
   * Récupérer un fournisseur par ID
   */
  getSupplierById(id: number): Observable<SupplierResponseDto> {
    return this.http.get<SupplierResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Mettre à jour un fournisseur
   */
  updateSupplier(id: number, dto: SupplierUpdateDto): Observable<SupplierResponseDto> {
    return this.http.put<SupplierResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Supprimer un fournisseur
   */
  deleteSupplier(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text',
    }) as Observable<string>;
  }
}
