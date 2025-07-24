import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardModule,
  GridModule,
  TableModule,
  ButtonModule,
  FormModule,
  SpinnerModule,
  ModalModule
} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilPencil, cilTrash, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { ProductService, Product } from '../../../service/product.service';
import { CustomModalComponent } from '../../../shared/components/custom-modal/custom-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    FormModule,
    IconModule,
    SpinnerModule,
    ModalModule,
    CustomModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [IconSetService]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  tableItems: any[][] = [];
  isLoading: boolean = false;
  
  // Propriedades para paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Propriedades para o modal de edição
  newProduct = false;
  editModalVisible = false;
  editingProductVazio: Product = {
    idProduct: 0,
    nameProduct: '',
    valueCost: 0,
    valueSale: 0,
    productDescription: '',
    barCode: ''
  };

  editingProduct = { ...this.editingProductVazio };

  
  // Adicionando Math e Number como propriedades do componente
  protected Math = Math;
  protected Number = Number;
  
  tableHeaders: any[] = [
    { text: 'ID', key: 'id' },
    { text: 'Nome do Produto', key: 'name' },
    { text: 'Valor de Custo', key: 'cost' },
    { text: 'Valor de Venda', key: 'sale' },
    { text: 'Descrição', key: 'description' },
    { text: 'Código de Barras', key: 'barcode' },
    { text: 'Editar', key: 'actions' },
    { text: 'Excluir', key: 'actions' }
  ];

  modalNotice: boolean = false;
  modalNoticeTitle: string = '';
  modalNoticeDescription: string = '';
  modalNoticeButtonPrimary: string = 'OK';

  constructor(
    private productService: ProductService,
    public iconSet: IconSetService
  ) {
    iconSet.icons = { cilPencil, cilTrash, cilChevronLeft, cilChevronRight };
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalItems = products.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateTable();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  openCreateProduct() {
    this.editingProduct = { ...this.editingProductVazio };
    this.newProduct = true;
    this.editModalVisible = true;
  }

  searchProducts() {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.products = products;
          this.totalItems = products.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.currentPage = 1; // Reset para primeira página na busca
          this.updateTable();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro na busca:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.loadProducts();
    }
  }

  updateTable() {
    if (this.products && this.products.length > 0) {
      // Calcula o índice inicial e final para a página atual
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      // Pega apenas os produtos da página atual
      const pageProducts = this.products.slice(startIndex, endIndex);
      
      this.tableItems = pageProducts.map(product => [
        { text: product.idProduct.toString() },
        { text: product.nameProduct },
        { text: `R$ ${product.valueCost.toFixed(2)}` },
        { text: `R$ ${product.valueSale.toFixed(2)}` },
        { text: product.productDescription},
        { text: product.barCode},
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

  editProduct(id: number) {
    const product = this.products.find(p => p.idProduct === id);
    if (product) {
      this.editingProduct = { ...product }; // Cria uma cópia do produto
      this.editModalVisible = true;
    }
  }

  saveProduct() {
    if (this.editingProduct) {
      this.isLoading = true;
      this.productService.saveProduct(this.editingProduct).subscribe({
        next: () => {
          this.editModalVisible = false;
          this.editingProduct = { ...this.editingProductVazio }; // Resetando o formulário
          this.loadProducts();
        },
        error: (error) => {
          const mensagem = error.error?.body || error.error || 'Erro ao salvar produto. Verifique os dados e tente novamente.';
          this.defineModalNotice("Ocorreu um erro", mensagem);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.editingProduct = { ...this.editingProduct };
      }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.isLoading = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          this.isLoading = false;
        }
      });
    }
  }

  defineModalNotice(title: string, description: string, buttonPrimary: string = 'OK') {
    this.modalNoticeTitle = title;
    this.modalNoticeDescription = description;
    this.modalNoticeButtonPrimary = buttonPrimary;
    this.modalNotice = true;
  }

  closeModal(event: any){
    this.modalNotice = false;
  }
}
