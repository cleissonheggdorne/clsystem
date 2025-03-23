import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentprod } from '../environments/environment.prod';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

export interface Employee {
  idEmployee: number;
  nameEmployee: string;
  document: string;
  initialDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environmentprod.apiUrl; 
  private apiUrlDev = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrlDev}/api/employee/findall`);
  }

  searchEmployees(key: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrlDev}/api/employee/find?key=${key}`);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlDev}/api/employee/delete`, {
      body: { "id":id }
    }).pipe(
      tap({
        next: () => console.log('Funcionário deletado com sucesso, ID:', id),
        error: (error) => console.error('Erro ao deletar produto:', error)
      })
    );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    console.log('Enviando funcionário para atualização:', employee);
    return this.http.put<Employee>(`${this.apiUrlDev}/api/employee/save`, employee)
      .pipe(
        tap({
          next: (response) => console.log('Produto atualizado com sucesso:', response),
          error: (error) => console.error('Erro ao atualizar produto:', error)
        })
      );
  }
}
