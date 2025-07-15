import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environmentprod } from '../environments/environment.prod';
import { environment } from '../environments/environment';


export interface Employee {
  idEmployee: number;
  nameEmployee: string;
}

export interface Cashier {
  idCashier: number;
  employee: Employee;
  dateHourOpenFormatted: string;
  dateHourCloseFormatted: string;
  amountSales: number;
}

export interface CashierSummary {
  Quantidade: {
    [key: string]: number;
  };
  Valor: {
    [key: string]: number;
  };
  Resumo: {
    [key: string]: number;
  };
}

export interface CashierStatus {
  isOpen: boolean;
  openingDate: string | null;
  currentCashierId: number | null;
  cashierData?: Cashier | null;
}

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private apiUrl = environmentprod.apiUrl;
  private apiUrlDev = environment.apiUrl;

  // BehaviorSubject para compartilhar o status do caixa
  private cashierStatusSubject = new BehaviorSubject<CashierStatus>({
    isOpen: false,
    openingDate: null,
    currentCashierId: null,
    cashierData: null
  });
  
  // Observable que os componentes podem assinar
  public cashierStatus$ = this.cashierStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar o status inicial do caixa
    this.checkCashierStatus();
  }

  getCashiers(): Observable<Cashier[]> {
    return this.http.get<Cashier[]>(`${this.apiUrlDev}/api/cashier/findall`);
  }

  searchCashiers(key: string): Observable<Cashier[]> {
    return this.http.get<Cashier[]>(`${this.apiUrlDev}/api/cashier/find?key=${key}`);
  }

  getOpenCashier(idEmployee: number): Observable<Cashier> {
    return this.http.get<Cashier>(`${this.apiUrlDev}/api/cashier/find-open?id=${idEmployee}`);
  }

  fetchSummaryByCashier(idCashier: number): Observable<CashierSummary[]> {
    return this.http.get<CashierSummary[]>(`${this.apiUrlDev}/api/cashier/summary-by-cashier?idCashier=${idCashier}`)
      .pipe(
        tap({
          next: (response) => console.log('Resumo do caixa carregado:', response),
          error: (error) => console.error('Erro ao carregar resumo do caixa:', error)
        })
      );
  }

  checkCashierResponse(cashier: any):void {
    if (cashier) {
      this.setCashier(cashier);
      const openCashier =cashier;
      // Atualizar o status do caixa para aberto
      this.cashierStatusSubject.next({
        isOpen: true,
        openingDate: openCashier.dateHourOpenFormatted,
        currentCashierId: openCashier.idCashier,
        cashierData: openCashier
      });
    } else {
      // Não há caixa aberto para este funcionário
      this.cashierStatusSubject.next({
        isOpen: false,
        openingDate: null,
        currentCashierId: null,
        cashierData: null
      });
    }
  }

  // Verificar o status do caixa
  checkCashierStatus(): void {
    // Obter o funcionário atual do localStorage
    const currentEmployee = this.getCurrentEmployee();
    
    if (currentEmployee && currentEmployee.idEmployee) {
      this.getOpenCashier(currentEmployee.idEmployee).subscribe({
        next: (cashier) => {
          this.checkCashierResponse(cashier);
        },
        error: (error) => {
          console.error('Erro ao verificar status do caixa:', error);
          this.cashierStatusSubject.next({
            isOpen: false,
            openingDate: null,
            currentCashierId: null,
            cashierData: null
          });
        }
      });
    } else {
      console.warn('Nenhum funcionário logado para verificar o caixa');
      this.cashierStatusSubject.next({
        isOpen: false,
        openingDate: null,
        currentCashierId: null,
        cashierData: null
      });
    }
  }

  closeCashier(): Observable<any> {
    const idCashier = this.getCashier().idCashier;
    return this.http.put<any>(`${this.apiUrlDev}/api/cashier/close`, { idCashier })
      .pipe(
        tap({
          next: (response) => {
            // Atualiza o status do caixa para fechado
            this.cashierStatusSubject.next({
              isOpen: false,
              openingDate: null,
              currentCashierId: null,
              cashierData: null
            });
            // Remove do localStorage se necessário
            localStorage.removeItem('cashier');
          },
          error: (error) => {
            console.error('Erro ao fechar o caixa:', error);
          }
        })
      );
  }

  openCashier(initialValue: number): Observable<any> {
    const idEmployee = this.getCurrentEmployee().idEmployee;
    return this.http.post<any>(`${this.apiUrlDev}/api/cashier/open`, { idEmployee, initialValue })
      .pipe(
        tap({
          next: (cashier) => {
              this.checkCashierResponse(cashier);
          },
          error: (error) => {
            console.error('Erro ao abrir o caixa:', error);
          }
        })
      );
  }

  // Obter o status atual do caixa
  getCurrentCashierStatus(): CashierStatus {
    return this.cashierStatusSubject.value;
  }

  // Atualizar o status do caixa manualmente
  updateCashierStatus(status: CashierStatus): void {
    this.cashierStatusSubject.next(status);
  }

  // Obter o funcionário atual do localStorage
  private getCurrentEmployee(): any {
    try {
      const employeeStr = localStorage.getItem('employee');
      return employeeStr ? JSON.parse(employeeStr) : null;
    } catch (error) {
      console.error('Erro ao obter funcionário do localStorage:', error);
      return null;
    }
  }

  setCashier(cashier: Cashier): void {
    localStorage.setItem('cashier', JSON.stringify(cashier));
  }

  // Obter o caixa atual (para compatibilidade com código existente)
  getCashier(): Cashier {
    // Primeiro verificar o status atual no BehaviorSubject
    const status = this.cashierStatusSubject.value;
    if (status.isOpen && status.cashierData) {
      return status.cashierData;
    }

    // Se não tiver dados no BehaviorSubject, tentar carregar do localStorage (comportamento anterior)
    try {
      const cashierStr = localStorage.getItem('cashier');
      if (cashierStr) {
        return JSON.parse(cashierStr);
      }
    } catch (error) {
      console.error('Erro ao obter caixa do localStorage:', error);
    }

    // Se não encontrar nada, retornar objeto vazio com idCashier = 0
    return { idCashier: 0 } as Cashier;
  }

  // Obter o ID do caixa aberto (ou 0 se não houver caixa aberto)
  getCashierId(): number {
    const cashier = this.getCashier();
    return cashier ? cashier.idCashier : 0;
  }
}
