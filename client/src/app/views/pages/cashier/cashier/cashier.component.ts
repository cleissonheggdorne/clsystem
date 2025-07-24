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
  TableModule
  
} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilPencil, cilTrash, cilChevronLeft, cilChevronRight, cilInfo } from '@coreui/icons';
import { CashierService, Cashier, CashierSummary } from '../../../../service/cashier.service';
import { CashierSummaryModalComponent } from '../../../../shared/components/cashier-summary-modal/cashier-summary-modal.component';

interface TableCell {
  text: string;
  html?: boolean;
}

interface TableHeader {
  key: string;
  text: string;
}

@Component({
  selector: 'app-cashier',
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
    CashierSummaryModalComponent
  ],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss',
  providers: [IconSetService]
})
export class CashierComponent implements OnInit {
  cashiers: Cashier[] = [];
  searchTerm = '';
  tableItems: any[][] = [];
  isLoading = false;
  
  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Modal de edição
  editModalVisible = false;
  editingCashier: Cashier = {
    idCashier: 0,
    employee: {
      idEmployee: 0,
      nameEmployee: ''
    },
    dateHourOpenFormatted: '',
    dateHourCloseFormatted: '',
    amountSales: 0
  };

  // Modal de resumo
  summaryModalVisible = false;
  summaryData: CashierSummary[] = [];
  //summaryTableHeaders: string[] = ['Tipo', 'Quantidade', 'Valor'];
  //summaryTableItems: any[][] = [];

  // Tabela
  tableHeaders: any[] = [
    { key: 'id', text: 'ID' },
    { key: 'employeeId', text: 'ID Funcionário' },
    { key: 'employeeName', text: 'Nome Funcionário' },
    { key: 'dateHourOpen', text: 'Data/Hora Abertura' },
    { key: 'dateHourClose', text: 'Data/Hora Fechamento' },
    { key: 'amount', text: 'Valor Total' },
    { key: 'actions', text: 'Consultar' }
  ];

  // Adicionando Math e Number como propriedades do componente
  protected Math = Math;
  protected Number = Number;

  constructor(
    private cashierService: CashierService,
    public iconSet: IconSetService
  ) {
    iconSet.icons = { cilPencil, cilTrash, cilChevronLeft, cilChevronRight, cilInfo };
  }

  ngOnInit(): void {
    this.loadCashiers();
  }

  loadCashiers(): void {
    this.isLoading = true;
    this.cashierService.getCashiers().subscribe({
      next: (cashiers) => {
        this.cashiers = cashiers;
        this.totalItems = cashiers.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateTable();
      },
      error: (error) => {
        console.error('Erro ao carregar caixas:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  searchCashiers(): void {
    if (!this.searchTerm.trim()) {
      this.loadCashiers();
      return;
    }

    this.isLoading = true;
    this.cashierService.searchCashiers(this.searchTerm).subscribe({
      next: (cashiers) => {
        this.cashiers = cashiers;
        this.totalItems = cashiers.length;
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
    const pageCashiers = this.cashiers.slice(start, end);

    this.tableItems = pageCashiers.map(cashier => [
      { text: cashier.idCashier.toString() },
      { text: cashier.employee.idEmployee.toString() },
      { text: cashier.employee.nameEmployee },
      { text: cashier.dateHourOpenFormatted },
      { text: cashier.dateHourCloseFormatted },
      { text: cashier.amountSales.toFixed(2) },
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

  editCashier(id: number): void {
    const cashier = this.cashiers.find(c => c.idCashier === id);
    if (cashier) {
      this.editingCashier = { ...cashier };
      this.editModalVisible = true;
    }
  }

  resumeByCashier(id: number): void {
    this.isLoading = true;
    this.cashierService.fetchSummaryByCashier(id).subscribe({
      next: (summary) => {
        this.summaryData = summary;
        this.summaryModalVisible = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.isLoading = false;
      }
    });
  }
}
