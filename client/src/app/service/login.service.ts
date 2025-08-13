import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment'; // Importe o ambiente
import { Customer, Employee } from './employee.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrlDev = environment.apiUrl; 
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any> {
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    };
    return this.http.post(`${this.apiUrlDev}/api/public/employee/authenticate`, {}, { headers })
      .pipe(
        tap((response: any) => {
          if (response) {
            // Verifica se a resposta é um objeto e tem pelo menos uma entrada
            if (typeof response === 'object' && Object.keys(response).length > 0) {
              // Pega a primeira chave como token
              const [token, employeeData] = Object.entries(response)[0];
              this.setToken(token);
              this.setEmployee(employeeData);
            }
          }
        })
      );
  }

  register(customer: Customer): Observable<Customer> {
      return this.http.post<Customer>(`${this.apiUrlDev}/api/public/employee/register`, customer);
    }

  alterPassword(passwordOld: string, passwordNew: string): Observable<any> {
    return this.http.put(`${this.apiUrlDev}/api/employee/alter-password`, {
      passwordOld, passwordNew,
    });
  }

  // Métodos para gerenciar o token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setEmployee(employee: any): void {
    localStorage.setItem('employee', JSON.stringify(employee));
  }

  getEmployee(): any {
    return JSON.parse(localStorage.getItem('employee') || '{}');
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
  }
}
