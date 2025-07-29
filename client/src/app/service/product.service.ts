import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

export interface Product {
  idProduct: number;
  nameProduct: string;
  valueCost: number;
  valueSale: number;
  productDescription: string;
  barCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrlDev = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlDev}/api/product/findall`);
  }

  searchProducts(key: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlDev}/api/product/find?key=${key}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlDev}/api/product/delete`, {
      body: { "id":id }
    }).pipe(
      tap({
        error: (error) => console.error('Erro ao deletar produto:', error)
      })
    );
  }

  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrlDev}/api/product/save`, product)
      .pipe(
        tap({
          error: (error) => console.error('Erro ao atualizar produto:', error)
        })
      );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrlDev}/api/product/save`, product)
      .pipe(
        tap({
          next: (response) => console.log('Produto atualizado com sucesso:', response),
          error: (error) => console.error('Erro ao atualizar produto:', error)
        })
      );
  }
} 