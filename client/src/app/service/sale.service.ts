import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

// export interface ItemSale {
//   idItemSale: number;
//   quantity: number;
//   amount: number;
//   unitaryValue: number;
//   idProductNameProduct: string;
//   idSale: number;
// }

// export interface Sale {
//   idSale?: number;
//   idCashier?: number;
//   formPayment?: string;
// }

// export interface Sale {
//   idSale?: number;
//   idCashier?: number;
//   formPayment?: string;
// }
// Interface para o produto
export interface Product {
  idProduct: number;
  nameProduct: string;
  valueSale: number;
}

// Interface para o item de venda
export interface ItemSale {
  idItemSale: number;
  quantity: number;
  unitaryValue: number;
  idProduct: Product;
}

// Interface para a venda completa com itens
export interface SaleWithItems {
  idSale: number;
  amount: number;
  formPayment: string;
  dateHourEntry: string;
  listItems: ItemSale[];
}

// Interface simplificada para operações básicas de venda
export interface Sale {
  idSale?: number;
  idCashier?: number;
  formPayment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrlDev = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Buscar itens de uma venda
  getItensSale(idSale: number, idCashier: number): Observable<any[]> {
    const params = new HttpParams()
      .set('idSale', idSale.toString())
      .set('idCashier', idCashier.toString());

    return this.http.get<any[]>(`${this.apiUrlDev}/api/itemsale/finditenssale`, { 
      params,
      observe: 'response' // Para acessar cabeçalhos e status
    }).pipe(
      map(response => {
        if (response.status === 204) {
          return [];
        }
        return response.body || [];
      }),
      tap(items => console.log('Itens carregados:', items)),
      catchError(error => {
        console.error('Erro ao carregar itens:', error);
        if (error.status === 204) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }

  getItensSaleV2(idSale: number, idCashier: number): Observable<SaleWithItems[]> {
    const params = new HttpParams()
      .set('idSale', idSale.toString())
      .set('idCashier', idCashier.toString());

    return this.http.get<any[]>(`${this.apiUrlDev}/api/sale/list-itens-by-sale`, { 
      params,
      observe: 'response' // Para acessar cabeçalhos e status
    }).pipe(
      map(response => {
        if (response.status === 204) {
          return [];
        }
        return response.body || [];
      }),
      catchError(error => {
        console.error('Erro ao carregar itens:', error);
        if (error.status === 204) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }

  // Buscar produtos por chave de pesquisa
  searchProducts(key: string): Observable<any> {
    const params = new HttpParams().set('key', key);
    return this.http.get(`${this.apiUrlDev}/api/product/find`, { params });
  }

  // Salvar um novo item de venda
  saveItem(item: ItemSale): Observable<any> {
    return this.http.post(`${this.apiUrlDev}/api/itemsale/save`, item);
  }

  // Atualizar um item de venda
  updateItem(item: any): Observable<any> {
    return this.http.put(`${this.apiUrlDev}/api/itemsale/save`, item);
  }

  // Fechar uma venda
  closeSale(idCashier: number, idSale: number, formPayment: string): Observable<any> {
    const payload = {
      idCashier,
      idSale,
      formPayment
    };
    return this.http.put(`${this.apiUrlDev}/api/sale/closesale`, payload);
  }

  // Cancelar uma venda
  cancelSale(idCashier: number, idSale: number): Observable<any> {
    const payload = {
      idCashier,
      idSale
    };
    return this.http.put(`${this.apiUrlDev}/api/sale/cancel-sale`, payload);
  }

  // Excluir um item de venda
  deleteItem(itemSale: any): Observable<any> {
    return this.http.put(`${this.apiUrlDev}/api/itemsale/delete`,itemSale);
  }
}
