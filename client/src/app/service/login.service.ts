import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment'; // Importe o ambiente
import { environmentprod } from '../environments/environment.prod'; // Importe o ambiente

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environmentprod.apiUrl; 
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
            console.log('Resposta do login:', response);
            // Verifica se a resposta é um objeto e tem pelo menos uma entrada
            if (typeof response === 'object' && Object.keys(response).length > 0) {
              // Pega a primeira chave como token
              const [token, employeeData] = Object.entries(response)[0];
              //console.log('Token:', token);
              //console.log('Dados do funcionário:', employeeData);
              this.setToken(token);
              this.setEmployee(employeeData);
            }
          }
        })
      );
  }

  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrlDev}/signup`, {
      email,
      username,
      password,
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
