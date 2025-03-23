import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  SpinnerModule,
  TableModule,
} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilPencil, cilTrash, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { EmployeeService, Employee } from '../../../../service/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    ModalModule,
    SpinnerModule,
    TableModule,
    IconModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers: [IconSetService]
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm = '';
  tableItems: any[][] = [];
  isLoading: boolean = false;
  
  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

// Modal de edição
editModalVisible = false;
editingEmployee: Employee = {
  idEmployee: 0,
  nameEmployee: '',
  document: '',
  initialDate: new Date(),
};
  // Adicionando Math e Number como propriedades do componente
  protected Math = Math;
  protected Number = Number;

  tableHeaders: any[] = [
    { text: 'ID', key: 'id' },
    { text: 'Nome do Funcionário', key: 'name' },
    { text: 'Documento', key: 'document' },
    { text: 'Data Inicial', key: 'initialDate' },
    { text: 'Editar', key: 'actions' },
    { text: 'Excluir', key: 'actions' }
  ];

  constructor(
    private employeeService: EmployeeService,
    public iconSet: IconSetService
  ) {
    iconSet.icons = { cilPencil, cilTrash, cilChevronLeft, cilChevronRight };
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        console.log('Funcionários carregados:', employees);
        this.employees = employees;
        this.totalItems = employees.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateTable();
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  searchEmployees(): void {
    if (!this.searchTerm.trim()) {
      this.loadEmployees();
      return;
    }

    this.isLoading = true;
    this.employeeService.searchEmployees(this.searchTerm).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.totalItems = employees.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.updateTable();
      },
      error: (error) => {
        console.error('Erro na busca:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateTable(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageEmployees = this.employees.slice(start, end);

    this.tableItems = pageEmployees.map(employee => [
      { text: employee.idEmployee.toString() },
      { text: employee.nameEmployee },
      { text: employee.document },
      { text: employee.initialDate },
      { text: '', html: true }
    ]);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateTable();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  editEmployee(id: number): void {
    const employee = this.employees.find(emp => emp.idEmployee === id);
    if (employee) {
      this.editingEmployee = { ...employee };
      this.editModalVisible = true;
    }
  }

  saveEmployee(): void {
    this.isLoading = true;
    this.employeeService.updateEmployee(this.editingEmployee).subscribe({
      next: () => {
        this.editModalVisible = false;
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Erro ao atualizar funcionário:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.isLoading = true;
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Erro ao excluir funcionário:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
