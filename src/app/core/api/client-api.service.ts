import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ClientCreateDto, ClientUpdateDto, ClientResponseDto } from '../models/client.models';

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/clients`;

  /**
   * Créer un nouveau client (admin)
   */
  create(dto: ClientCreateDto): Observable<ClientResponseDto> {
    return this.http.post<ClientResponseDto>(this.baseUrl, dto);
  }

  /**
   * Récupérer tous les clients
   */
  getAll(): Observable<ClientResponseDto[]> {
    return this.http.get<ClientResponseDto[]>(this.baseUrl);
  }

  /**
   * Récupérer par ID
   */
  getById(id: number): Observable<ClientResponseDto> {
    return this.http.get<ClientResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Mettre à jour un client
   */
  update(id: number, dto: ClientUpdateDto): Observable<ClientResponseDto> {
    return this.http.put<ClientResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Supprimer
   */
  delete(id: number): Observable<ClientResponseDto> {
    return this.http.delete<ClientResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Désactiver
   */
  deactivate(id: number): Observable<ClientResponseDto> {
    return this.http.patch<ClientResponseDto>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  /**
   * Activer
   */
  activate(id: number): Observable<ClientResponseDto> {
    return this.http.patch<ClientResponseDto>(`${this.baseUrl}/${id}/activate`, {});
  }
}

