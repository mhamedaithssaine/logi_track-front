import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ShipmentFullResponseDto } from '../models/shipment.models';

@Injectable({ providedIn: 'root' })
export class ShipmentApiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/shipments`;
  private ordersUrl = `${API_CONFIG.baseUrl}/orders`;

  listByClientId(clientId: number): Observable<ShipmentFullResponseDto[]> {
    const params = new HttpParams().set('clientId', clientId.toString());
    return this.http.get<ShipmentFullResponseDto[]>(this.baseUrl, { params });
  }

  getByOrderId(orderId: number): Observable<ShipmentFullResponseDto> {
    return this.http.get<ShipmentFullResponseDto>(`${this.ordersUrl}/${orderId}/shipment`);
  }

  /** Liste de toutes les expéditions (Warehouse / Admin) */
  listAll(): Observable<ShipmentFullResponseDto[]> {
    return this.http.get<ShipmentFullResponseDto[]>(this.baseUrl);
  }

  getById(shipmentId: number): Observable<ShipmentFullResponseDto> {
    return this.http.get<ShipmentFullResponseDto>(`${this.baseUrl}/${shipmentId}`);
  }

  createShipment(orderId: number, dto: { carrier: string; trackingNumber: string }): Observable<ShipmentFullResponseDto> {
    const body = { orderId, carrier: dto.carrier, trackingNumber: dto.trackingNumber };
    return this.http.post<ShipmentFullResponseDto>(`${this.ordersUrl}/${orderId}/shipments`, body);
  }

  updateStatus(shipmentId: number, status: string): Observable<ShipmentFullResponseDto> {
    return this.http.post<ShipmentFullResponseDto>(
      `${this.baseUrl}/${shipmentId}/status`,
      null,
      { params: { status } }
    );
  }

  shipOrder(orderId: number): Observable<ShipmentFullResponseDto> {
    return this.http.post<ShipmentFullResponseDto>(`${this.ordersUrl}/${orderId}/ship`, { orderId });
  }

  deliver(shipmentId: number): Observable<ShipmentFullResponseDto> {
    return this.http.post<ShipmentFullResponseDto>(`${this.ordersUrl}/shipments/${shipmentId}/deliver`, { shipmentId });
  }
}
