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
import { CustomModalComponent } from '../../../../shared/components/custom-modal/custom-modal.component';

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
    IconModule,
    CustomModalComponent // Importando o componente de modal personalizado
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

// Modal de edição /Novo
newEmployee = false;
editModalVisible = false;
editingEmployeeVazio: Employee = {
  idEmployee: 0,
  nameEmployee: '',
  document: '',
  initialDate: this.formatDate(new Date()),
  password:'',
  email: '',
  customer: {
    idCustomer: '',
    name: '',
    document: '',
    email: '',
    password: ''
  }
};
editingEmployee = { ...this.editingEmployeeVazio };
  // Adicionando Math e Number como propriedades do componente
  protected Math = Math;
  protected Number = Number;

  tableHeaders: any[] = [
    { text: 'ID', key: 'id' },
    { text: 'Nome do Funcionário', key: 'name' },
    { text: 'Documento', key: 'document' },
    { text: 'Data Inicial', key: 'initialDate' },
    { text: 'Email', key: 'email' },
    { text: 'Editar', key: 'actions' },
    { text: 'Excluir', key: 'actions' }
  ];

  // Modal de Avisos
  modalNotice: boolean = false;
  modalNoticeTitle: string = '';
  modalNoticeDescription: string = '';
  modalNoticeButtonPrimary: string = 'OK';


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
      { text: employee.email },
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
      this.newEmployee = false;
      this.editModalVisible = true;
    }
  }

  openCreateEmployee():void{
    this.editingEmployee = { ...this.editingEmployeeVazio };
    this.newEmployee = true;
    this.editModalVisible = true;
  }

  saveEmployee(): void {
    this.isLoading = true;
    this.employeeService.saveEmployee(this.editingEmployee).subscribe({
      next: () => {
        this.editModalVisible = false;
        this.editingEmployee = { ...this.editingEmployeeVazio }; // Resetando o formulário
        this.loadEmployees();
      },
      error: (error) => {
        const mensagem = error.error?.body || error.error || 'Erro ao salvar funcionário. Verifique os dados e tente novamente.';
        this.defineModalNotice("Ocorreu um erro", mensagem);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.editingEmployee = { ...this.editingEmployeeVazio };
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

  formatDate(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  defineModalNotice(title: string, description: string, buttonPrimary: string = 'OK') {
    this.modalNoticeTitle = title;
    this.modalNoticeDescription = description;
    this.modalNoticeButtonPrimary = buttonPrimary;
    this.modalNotice = true;
  }
}
