import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalField } from 'src/app/shared/components/custom-modal/custom-modal.component';

import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  TableModule,
  ModalModule,
  SpinnerModule,
  TableDirective
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilPencil, cilTrash } from '@coreui/icons';
import { SaleService, ItemSale, Sale, SaleWithItems } from '../../../../service/sale.service';
import { CashierService } from '../../../../service/cashier.service';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component'; // Adicione esta linha no topo
import { CustomModalComponent } from '../../../../shared/components/custom-modal/custom-modal.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    TableModule,
    TableDirective,
    ModalModule,
    SpinnerModule,
    IconModule,
    PaymentModalComponent,
    CustomModalComponent
  ],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss',
  providers: [IconSetService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SaleComponent implements OnInit {
  // Estados  
  isLoading = false;
  isSearching = false;
  searchTerm = '';
  tableItems: any[][] = [];

  // Dropdown de produtos
  filteredProducts: any[] = [];
  showProductsDropdown = false;
  
  // Propriedades para paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

 // Adicionando Math e Number como propriedades do componente
 protected Math = Math;
 protected Number = Number;

  tableHeaders: any[] = [
    { text: 'ID', key: 'id' },
    { text: 'Quantidade', key: 'quantity' },
    { text: 'Descrição', key: 'description' },
    { text: 'Valor Unitário', key: 'unitaryValue' },
    { text: 'Total', key: 'total' },
    { text: 'Ações', key: 'actions' },
  ];

  // Dados da venda atual
  currentSale: Sale = {
    idSale: 0,
    idCashier: 0,
    formPayment: ''
  };
  
  // Itens da venda
  saleItems: ItemSale[] = [];
  
  saleWithItems: SaleWithItems[] = [];

  // Produto selecionado para adicionar
  selectedProduct: any = {
    quantity: 1,
    unitaryValue: 0.00,
    nameProduct: '',
    idProduct: 0
  };
  // Último produto selecionado
  selectedLastProduct: any = {
    quantity: 1,
    unitaryValue: 0.00,
    nameProduct: '',
    idProduct: 0
  };
  
  // Controle do modal
  editItemModalVisible = false;
  deleteItemModalVisible = false;
  showPaymentModal = false;

  // Propriedades para o modal de edição
  editingItem: any = {
    idItemSale: 0,
    quantity: 0,
    amount: 0,
    unitaryValue: 0,
    nameProduct: "",
    idSale: 0,
  };

  // Propriedades para modal de cancelamento de venda
  modalCancelSale: boolean = false;
  cancelSaleModalTitle = 'Você está prestes a cancelar a venda por completo.'
  cancelSaleModalDescription = 'Deseja continuar?'


  constructor(
    private saleService: SaleService,
    private iconSetService: IconSetService,
    private cashierService: CashierService
  ) {
    this.iconSetService.icons = { cilPencil, cilTrash };
  }

  ngOnInit(): void {
    // Obter o ID do caixa com a propriedade correta
    const cashier = this.cashierService.getCashier();
    this.currentSale.idCashier = cashier ? cashier.idCashier : 0;
    this.loadSaleItemsV2 (this.currentSale.idSale!, this.currentSale.idCashier!);
  }

  // Buscar itens de uma venda específica
  loadSaleItems(idSale: number, idCashier: number): void {
    this.isLoading = true;
    this.saleService.getItensSale(idSale, idCashier).subscribe({
      next: (items) => {
        this.currentSale.idSale = items[0].idSale.idSale
        this.saleItems = items;
        this.totalItems = items.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateTable();
        this.isLoading=false;
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadSaleItemsV2(idSale: number, idCashier: number): void {
    this.isLoading = true;
    this.saleService.getItensSaleV2(idSale, idCashier).subscribe({
      next: (item) => {
        if(item.length === 0){
          return;
        }
        this.saleWithItems = item;
        this.currentSale.idSale = item[0].idSale
        this.saleItems = item[0].listItems;
        this.totalItems = item[0].listItems.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateTableV2();
        this.isLoading=false;
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  updateTable() {
    if (this.saleItems && this.saleItems.length > 0) {
      // Calcula o índice inicial e final para a página atual
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      // Pega apenas os produtos da página atual
      const pageItems = this.saleItems.slice(startIndex, endIndex);
      
      this.tableItems = pageItems.map(item => [
        { text: item.idItemSale.toString() },
        { text: item.quantity.toString() },
      //  { text: item.idProductNameProduct },
        { text: `R$ ${item.unitaryValue.toFixed(2)}` },
     //   { text: `R$ ${item.amount.toFixed(2)}` },
        { html: true } // Marca a última coluna como HTML para renderizar os botões
      ]);
    } else {
      this.tableItems = [];
    }
  }

  updateTableV2() {
    if (this.saleItems && this.saleItems.length > 0) {
      // Calcula o índice inicial e final para a página atual
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      // Pega apenas os produtos da página atual
      const pageItems = this.saleItems.slice(startIndex, endIndex);
      
      this.tableItems = pageItems.map(item => [
        { text: item.idItemSale.toString() },
        { text: item.quantity.toString() },
        { text: item.idProduct.nameProduct },
        { text: `R$ ${item.unitaryValue.toFixed(2)}` },
        { text: `R$ ${(item.unitaryValue*item.quantity).toFixed(2)}` },
        { html: true } // Marca a última coluna como HTML para renderizar os botões
      ]);
    } else {
      this.tableItems = [];
    }
  }
  // Métodos para paginação
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateTableV2();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  // Buscar produtos quando o usuário digita
  onSearchKeyUp(): void {
    // Mostrar dropdown apenas se tiver 3 ou mais caracteres
    if (this.searchTerm.length >= 3) {
      this.searchProducts();
    } else {
      this.showProductsDropdown = false;
      this.filteredProducts = [];
    }
    
    // Log para debug
    this.logDropdownState();
  }

  // Buscar produtos por termo de pesquisa
  searchProducts(): void {
    if (this.searchTerm.length < 3) return;

    this.isSearching = true;
    this.showProductsDropdown = true;
    
    this.saleService.searchProducts(this.searchTerm).subscribe({
      next: (products) => {
        this.filteredProducts = products || [];
        this.showProductsDropdown = true;

      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.filteredProducts = [];
        this.showProductsDropdown = true;
      },
      complete: () => {
        this.isSearching = false;
      }
    });
  }

  // Selecionar o primeiro produto da lista
  selectFirstProduct(): void {
    if (this.filteredProducts.length > 0) {
      this.selectProduct(this.filteredProducts[0]);
    }
  }

  // Selecionar um produto da lista
  selectProduct(product: any): void {
    
    this.showProductsDropdown = false;
    
    this.selectedProduct = {
      nameProduct: product.nameProduct,
      quantity: this.selectedProduct.quantity || 1,
      idProduct: product.idProduct,
      unitaryValue: product.valueSale,
    };

    this.selectedLastProduct = {...this.selectedProduct}; //Replica Objeto
    
    // Atualizar o campo de busca
    this.searchTerm = product.nameProduct;
    
    // Adicionar automaticamente à venda
    setTimeout(() => {
      this.addProductToSale();
    }, 100);
  }

  // Adicionar/Salvar item na venda
  saveItem(item: ItemSale): void {
    this.isLoading = true;
    this.saleService.saveItem(item).subscribe({
      next: (savedItem) => {
        this.loadSaleItemsV2(this.currentSale.idSale!, this.currentSale.idCashier!);
      },
      error: (error) => {
        console.error('Erro ao salvar item:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Atualizar item da venda
  updateItem(item: ItemSale): void {
    this.isLoading = true;
    this.saleService.updateItem(item).subscribe({
      next: (updatedItem) => {
        console.log('Item atualizado:', updatedItem);
        this.loadSaleItemsV2(this.currentSale.idSale!, this.currentSale.idCashier!);
      },
      error: (error) => {
        console.error('Erro ao atualizar item:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Fechar a venda
  closeSale(): void {
    if (!this.currentSale.idSale || !this.currentSale.idCashier || !this.currentSale.formPayment) {
      console.error('Dados incompletos para fechar a venda');
      return;
    }

    this.saleService.closeSale(
      this.currentSale.idCashier,
      this.currentSale.idSale,
      this.currentSale.formPayment
    ).subscribe({
      next: (result) => {
        this.updateTableV2();
        this.saleItems = [];
        this.modalCancelSale = false;
      },
      error: (error) => {
        alert("Erro ao fechar venda!");
      },
      complete: () => {
        this.updateTableV2();
        this.saleItems = [];
        this.modalCancelSale = false;
      }
    });
  }

  // Cancelar a venda
  cancelSale(): void {
    if (!this.currentSale.idSale || !this.currentSale.idCashier) {
      console.error('Dados incompletos para cancelar a venda');
      return;
    }
    this.saleService.cancelSale(this.currentSale.idCashier, this.currentSale.idSale).subscribe({
      next: (result) => {
        this.updateTableV2();
        this.saleItems = [];
        this.modalCancelSale = false;
      },
      error: (error) => {
        alert("Erro ao cancelar venda!");
      },
      complete: () => {
        this.updateTableV2();
        this.saleItems = [];
        this.modalCancelSale = false;
      }
    });

  }

  // Métodos auxiliares
  calculateTotal(): number {
    return this.saleItems.reduce((total, item) => {
      const quantity = Number(item.quantity);
      const unitaryValue = Number(item.unitaryValue);
      const itemTotal = quantity * unitaryValue;
      return total + itemTotal;
    }, 0);
  }

  // Método para editar um item
  editItem(idItemSale: number): void {
    const itemSale = this.saleItems.find(p => p.idItemSale === idItemSale);
    console.log("item sale:"+itemSale);
    if (itemSale) {
       this.editingItem = {
         idItemSale: itemSale.idItemSale,
         quantity: itemSale.quantity,
         nameProduct: itemSale.idProduct.nameProduct,
        }; 
       this.editItemModalVisible = true;
    }
  }
  
  // Método para salvar alterações do modal
  saveItemChanges(): void {
    if (this.editingItem) {
      const itemEdited = {
        "idItemSale" : this.editingItem.idItemSale,
        "quantity" : this.editingItem.quantity,
        "idCashier": this.currentSale.idCashier
      }
      this.saleService.updateItem(itemEdited).subscribe({
        next: (itemEdited) => {
          if(itemEdited){
            this.saleItems = this.saleItems.filter(item => item.idItemSale !== itemEdited.idItemSale);
            this.saleItems.push(itemEdited);
          }
          this.updateTableV2();
          this.editItemModalVisible = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar produto:', error);
        }
      });
    }
  }
  
  
  // Método para deletar um item
  deleteItemDataModal(idItemSale: number): void {
    const itemSale = this.saleItems.find(p => p.idItemSale === idItemSale);
    console.log("item sale:"+itemSale);
    if (itemSale) {
      this.editingItem = {
        idItemSale: itemSale.idItemSale,
        quantity: itemSale.quantity,
        nameProduct: itemSale.idProduct.nameProduct,
        amount:itemSale.quantity*itemSale.unitaryValue
       };
      this.deleteItemModalVisible = true;
    }
  }

  deleteItem(): void {
    if (this.editingItem) {
      const itemEdited = {
        "idItemSale" : this.editingItem.idItemSale,
        "quantity" : this.editingItem.quantity,
        "idCashier": this.currentSale.idCashier
      }
      //this.isLoading = true;
      this.saleService.deleteItem(itemEdited).subscribe({
        next: (msg) => {
         this.saleItems = this.saleItems.filter(item => item.idItemSale !== this.editingItem.idItemSale);
         this.updateTableV2();
         this.deleteItemModalVisible = false;
        },
        error: (error) => {
         console.error('Erro ao atualizar produto:', error);
        }
      });
    }
  }
  // Formatar valor em reais
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Método para adicionar produto à venda
  addProductToSale(): void {
    if (!this.selectedProduct.nameProduct) {
      alert('Selecione um produto primeiro!');
      return;
    }

    if (!this.selectedProduct.quantity || this.selectedProduct.quantity <= 0) {
      alert('Informe uma quantidade válida!');
      return;
    }

    // Criar item de venda
    const item: any = {
      idItemSale: null, // Será gerado pelo server
      quantity: this.selectedProduct.quantity,
      idProduct: this.selectedProduct.idProduct,
      idSale: this.currentSale.idSale || null,
      idCashier: this.currentSale.idCashier || null
    };

    // Salvar item
   // this.isLoading = true;
    this.saleService.saveItem(item).subscribe({
      next: (savedItem) => {        
        // Adicionar o item à lista local para atualização imediata
        if (savedItem) {
          this.saleItems.push(savedItem);
          this.currentSale.idSale = savedItem.idSale.idSale; // Atualizar o ID da venda atual
        } 
        // Atualizar a tabela de itens
        this.updateTableV2()        
        
        // Limpar o campo de busca
        this.searchTerm = '';
      },
      error: (error) => {
        console.error('Erro ao salvar item:', error);
        alert('Erro ao adicionar item à venda. Tente novamente.');
      },
      complete: () => {
        //this.isLoading = false;
        this.updateTableV2()        

        // Limpar seleção
        this.selectedProduct = {
          quantity: 0,
          unitaryValue: 0,
          idProductNameProduct: ''
        };
      }
    });
  }

  // Fechar dropdown quando clicar fora dele
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Não fechar se o clique foi dentro do dropdown ou no input de busca
    if (target.closest('.dropdown') || target.classList.contains('form-control')) {
      return;
    }    
    this.showProductsDropdown = false;
  }

  // Método para debug
  logDropdownState(): void {
    console.log({
      showProductsDropdown: this.showProductsDropdown,
      filteredProductsLength: this.filteredProducts.length,
      searchTerm: this.searchTerm,
      isLoading: this.isLoading,
      isSearching: this.isSearching
    });
  }

  trackByHeaderKey(index: number, header: any): string {
    return header.key;
  }

  trackByItemId(index: number, item: any): any {
    return item[0]?.text || index; // Use um identificador único ou o índice como fallback
  }

  trackByCellIndex(index: number, cell: any): number {
    return index; // Use o índice como chave única para células
  }

  openPaymentModal(): void {
    if (!this.currentSale.idSale || !this.currentSale.idCashier) {
         console.error('Dados incompletos para finalizar a venda');
         return;
    }
    this.showPaymentModal = true;
  }
  
  handlePaymentComplete(paymentDetails: any): void {
    this.currentSale.formPayment = paymentDetails.paymentMethod;
    this.closeSale();
  }
}
