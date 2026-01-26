import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ProductCreateDto, ProductUpdateDto, ProductResponseDto } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/products`;

  /**
   * Créer un nouveau produit
   */
  createProduct(dto: ProductCreateDto): Observable<ProductResponseDto> {
    return this.http.post<ProductResponseDto>(this.baseUrl, dto);
  }

  /**
   * Récupérer tous les produits
   */
  getAllProducts(): Observable<ProductResponseDto[]> {
    return this.http.get<ProductResponseDto[]>(this.baseUrl);
  }

  /**
   * Récupérer un produit par SKU
   */
  getProductBySku(sku: string): Observable<ProductResponseDto> {
    return this.http.get<ProductResponseDto>(`${this.baseUrl}/${sku}`);
  }

  /**
   * Mettre à jour un produit
   */
  updateProduct(sku: string, dto: ProductUpdateDto): Observable<ProductResponseDto> {
    return this.http.put<ProductResponseDto>(`${this.baseUrl}/${sku}`, dto);
  }

  /**
   * Supprimer un produit
   */
  deleteProduct(sku: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${sku}`, {
      responseType: 'text',
    }) as Observable<string>;
  }

  /**
   * Désactiver un produit
   */
  deactivateProduct(sku: string): Observable<ProductResponseDto> {
    return this.http.patch<ProductResponseDto>(`${this.baseUrl}/${sku}/deactivate`, {});
  }
}

