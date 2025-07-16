import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CashierSummary } from '../../../service/cashier.service';
import { ButtonModule, ModalModule, SpinnerModule } from '@coreui/angular';

@Component({
  selector: 'app-cashier-summary-modal',
  standalone: true,
  imports: [
    ModalModule,
    SpinnerModule,
    ButtonModule    
  ],
  templateUrl: './cashier-summary-modal.component.html',
  styleUrl: './cashier-summary-modal.component.scss'
})
export class CashierSummaryModalComponent {
  @Input() visible = false;
  @Input() summaryData: CashierSummary[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() extraButtonText?: string;
  @Input() extraButtonVisible: boolean = false;
  @Output() extraButtonClick = new EventEmitter<void>();
 // Modal de resumo
  isLoading = false;

  summaryModalVisible = false;
  summaryTableHeaders: string[] = ['Tipo', 'Quantidade Vendas','Valor Total'];
  summaryTableItems: any[][] = [];

  ngOnChanges() {
    this.updateSummaryTable();
      console.log('extraButtonVisible mudou:', this.extraButtonVisible);

  }

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  
  updateSummaryTable(): void {
    // const formatarMoeda = (valor: number): string => {
    //   return valor.toLocaleString('pt-BR', {
    //     style: 'currency',
    //     currency: 'BRL'
    //   });
    // };
    const tiposMap = new Map();
    
    if (!Array.isArray(this.summaryData)) {
      this.summaryData = [this.summaryData];
    }
    
    this.summaryData.forEach(item => {
      if (item.Quantidade) {
       // const quantidade = item.Quantidade;
        // Processar diretamente as propriedades do objeto Quantidade
        for (const [tipo, quantidade] of Object.entries(item.Quantidade)) {
          for (const [chave, valor] of Object.entries(quantidade)) {
            console.log(chave, valor);
            if (!tiposMap.has(chave)) {
              tiposMap.set(chave, { tipo: chave, quantidade: 0, valor: 0 });
            }
            tiposMap.get(chave).quantidade = Number(valor) || 0;
          }
        }
      }
      if (item.Valor) {
        // Processar diretamente as propriedades do objeto Valor
        for (const [tipo, valor] of Object.entries(item.Valor)) {
          for (const [chave, val] of Object.entries((valor))) {
            console.log(chave, val);
            if (!tiposMap.has(chave)) {
              tiposMap.set(chave, { tipo:chave, quantidade: 0, valor: 0 });
            }
            tiposMap.get(chave).valor = Number(val) || 0;
          }
        }
      }
    });

    // Converter o Map em array de linhas da tabela e ordenar por tipo
    this.summaryTableItems = Array.from(tiposMap.values())
      .sort((a, b) => a.tipo.localeCompare(b.tipo))
      .map(({ tipo, quantidade, valor }) => [
        { text: tipo },
        { text: quantidade.toString() },
        { text: Number(valor).toFixed(2) }
      ]);

    // Adicionar linha de total
    const totais = {
      quantidade: Array.from(tiposMap.values()).reduce((sum, item) => sum + Number(item.quantidade || 0), 0),
      valor: Array.from(tiposMap.values()).reduce((sum, item) => sum + Number(item.valor || 0), 0)
    };

    // Adicionar uma linha em branco como separador
    this.summaryTableItems.push([
      { text: '---' },
      { text: '---' },
      { text: '---' }
    ]);

    // Adicionar linha de total
    this.summaryTableItems.push([
      { text: 'TOTAL' },
      { text: totais.quantidade.toString() },
      { text: Number(totais.valor).toFixed(2) }
    ]);
  }
}
