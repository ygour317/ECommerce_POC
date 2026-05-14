import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  sku: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  sku: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/products`;

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  create(body: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.base, body);
  }

  update(id: number, body: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}
