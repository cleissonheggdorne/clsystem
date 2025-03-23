import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { SaleService, ItemSale, Sale } from '../../../../service/sale.service';
import { CashierService } from '../../../../service/cashier.service';

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
    IconModule
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
    { text: 'Editar', key: 'actions' },
    { text: 'Excluir', key: 'actions' }
  ];

  // Dados da venda atual
  currentSale: Sale = {
    idSale: 0,
    idCashier: 0,
    formPayment: ''
  };
  
  // Itens da venda
  saleItems: ItemSale[] = [];
  
  // Produto selecionado para adicionar
  selectedProduct: any = {
    quantity: 0,
    unitaryValue: 0,
    idProductNameProduct: ''
  };
  
  // Controle do modal
  modalVisible = false;

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
    this.loadSaleItems (this.currentSale.idSale!, this.currentSale.idCashier!);
  }

  // Buscar itens de uma venda específica
  loadSaleItems(idSale: number, idCashier: number): void {
    this.isLoading = true;
    this.saleService.getItensSale(idSale, idCashier).subscribe({
      next: (items) => {
        console.log('Itens carregados:', items);
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
        { text: item.idProductNameProduct },
        { text: `R$ ${item.unitaryValue.toFixed(2)}` },
        { text: `R$ ${item.amount.toFixed(2)}` },
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
      this.updateTable();
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
        console.log('Produtos encontrados:', products);
        this.filteredProducts = products || [];
        
        // Garantir que o dropdown permaneça aberto se houver resultados
        this.showProductsDropdown = true;
        
        // Log para debug
        console.log('Dropdown visível:', this.showProductsDropdown);
        console.log('Produtos filtrados:', this.filteredProducts);
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.filteredProducts = [];
        // Manter o dropdown aberto mesmo com erro, para mostrar a mensagem
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
    console.log('Produto selecionado:', product);
    
    // Fechar o dropdown imediatamente
    this.showProductsDropdown = false;
    
    // Atualizar o produto selecionado
    this.selectedProduct = {
      idProductNameProduct: product.nameProduct,
      quantity: 1,
      unitaryValue: product.valueSale || 0,
      idProduct: product.idProduct
    };
    
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
        console.log('Item salvo:', savedItem);
        this.loadSaleItems(this.currentSale.idSale!, this.currentSale.idCashier!);
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
        this.loadSaleItems(this.currentSale.idSale!, this.currentSale.idCashier!);
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

    this.isLoading = true;
    this.saleService.closeSale(
      this.currentSale.idCashier,
      this.currentSale.idSale,
      this.currentSale.formPayment
    ).subscribe({
      next: (result) => {
        console.log('Venda fechada com sucesso:', result);
        // Lógica após fechar a venda
      },
      error: (error) => {
        console.error('Erro ao fechar venda:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Cancelar a venda
  cancelSale(): void {
    if (!this.currentSale.idSale || !this.currentSale.idCashier) {
      console.error('Dados incompletos para cancelar a venda');
      return;
    }

    if (confirm('Tem certeza que deseja cancelar esta venda?')) {
      this.isLoading = true;
      this.saleService.cancelSale(
        this.currentSale.idCashier,
        this.currentSale.idSale
      ).subscribe({
        next: (result) => {
          console.log('Venda cancelada com sucesso:', result);
          // Lógica após cancelar a venda
        },
        error: (error) => {
          console.error('Erro ao cancelar venda:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  // Métodos auxiliares
  calculateTotal(): number {
    return this.saleItems.reduce((total, item) => total + (item.amount || 0), 0);
  }

  // Método para editar um item
  editItem(item: ItemSale): void {
    // Criar uma cópia do item para edição
    this.selectedProduct = { 
      ...item,
      // Garantir que todos os campos necessários estejam presentes
      idProductNameProduct: item.idProductNameProduct,
      quantity: item.quantity,
      unitaryValue: item.unitaryValue,
      idItemSale: item.idItemSale,
      idSale: item.idSale
    };
    
    this.modalVisible = true;
  }

  // Método para deletar um item
  deleteItem(idItemSale: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.isLoading = true;
      
      // Implementar lógica de exclusão
      console.log('Deletando item:', idItemSale);
      
      // Chamar o serviço para excluir o item no backend
      this.saleService.deleteItem(idItemSale).subscribe({
        next: (response) => {
          console.log('Item excluído com sucesso:', response);
          
          // Remover o item localmente para feedback imediato
          this.saleItems = this.saleItems.filter(i => i.idItemSale !== idItemSale);
          
          // Atualizar o total da venda
          this.calculateTotal();
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao excluir item:', error);
          this.isLoading = false;
          alert('Erro ao excluir o item. Por favor, tente novamente.');
        }
      });
    }
  }

  // Método para salvar alterações do modal
  saveItemChanges(): void {
    if (this.selectedProduct) {
      this.updateItem(this.selectedProduct);
      this.modalVisible = false;
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
    if (!this.selectedProduct.idProductNameProduct) {
      alert('Selecione um produto primeiro!');
      return;
    }

    if (!this.selectedProduct.quantity || this.selectedProduct.quantity <= 0) {
      alert('Informe uma quantidade válida!');
      return;
    }

    // Criar item de venda
    const item: any = {
      idItemSale: null, // Será gerado pelo backend
      quantity: this.selectedProduct.quantity,
      //unitaryValue: this.selectedProduct.unitaryValue,
      //amount: this.selectedProduct.quantity * this.selectedProduct.unitaryValue,
      idProduct: this.selectedProduct.idProduct,
      idSale: this.currentSale.idSale || null,
      idCashier: 6//this.currentSale.idCashier || null
    };

    console.log('Item a ser salvo:', item);

    // Salvar item
    this.isLoading = true;
    this.saleService.saveItem(item).subscribe({
      next: (savedItem) => {
        console.log('Item salvo:', savedItem);
        
        // Adicionar o item à lista local para atualização imediata
        if (savedItem) {
          // Se o backend retornou o item salvo, usamos ele
          this.saleItems.push(savedItem);
        } else {
          // Caso contrário, usamos o item que enviamos
          this.saleItems.push(item);
        }
        
        // Recarregar a lista completa do backend
        this.loadSaleItems(this.currentSale.idSale!, this.currentSale.idCashier!);
        
        // Limpar o campo de busca
        this.searchTerm = '';
      },
      error: (error) => {
        console.error('Erro ao salvar item:', error);
        alert('Erro ao adicionar item à venda. Tente novamente.');
      },
      complete: () => {
        this.isLoading = false;
        
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
    
    console.log('Clique fora do dropdown, fechando...');
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
}
