import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentprod } from '../environments/environment.prod';
import { environment } from '../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

export interface ItemSale {
  idItemSale: number;
  quantity: number;
  amount: number;
  unitaryValue: number;
  idProductNameProduct: string;
  idSale: number;
}

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
  private apiUrlProd = environmentprod.apiUrl;

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
        // Se for 204 No Content, retorna array vazio
        if (response.status === 204) {
          return [];
        }
        // Caso contrário, retorna os dados da resposta
        return response.body || [];
      }),
      tap(items => console.log('Itens carregados:', items)),
      catchError(error => {
        console.error('Erro ao carregar itens:', error);
        if (error.status === 204) {
          // Trata 204 como array vazio, não como erro
          return of([]);
        }
        // Re-lança outros erros
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
  updateItem(item: ItemSale): Observable<any> {
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
  deleteItem(idItemSale: number): Observable<any> {
    return this.http.delete(`${this.apiUrlDev}/api/itemsale/delete`, { 
      body: { idItemSale }
    });
  }
}
