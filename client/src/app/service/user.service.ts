import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api'; // Defina o endpoint correto

  constructor(private http: HttpClient) {}
 
  // Registra um novo usuário
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

   // Obtém todos os usuários
   getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Deleta um usuário
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtém os tipos de usuário
  getUserTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-types`);
  }  
}
