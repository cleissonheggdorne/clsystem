import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ButtonModule, 
  CardModule,
  FormModule,
  ListGroupModule,
  ModalModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ListGroupModule, 
    FormsModule,
    ButtonModule,
    CardModule,
    FormModule,
    IconModule,
    ModalModule
  ],
  templateUrl: './payment-modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PaymentModalComponent {
  @Input() visible = false;
  @Input() total = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onConclude = new EventEmitter<any>();

  selectedPayment: string = '';
  receivedAmount: number = 0;
  changeAmount: number = 0;

  paymentMethods = [
    { id: 'DINHEIRO', name: 'Dinheiro', icon: 'cil-money' },
    { id: 'CARTÃO_DE_CRÉDITO', name: 'Cartão de Crédito', icon: 'cil-credit-card' },
    { id: 'CARTÃO_DE_DÉBITO', name: 'Cartão de Débito', icon: 'cil-credit-card' },
    { id: 'PIX', name: 'Pix', icon: 'cil-bank' }
  ];

  get canConclude(): boolean {
    if (this.selectedPayment === 'DINHEIRO') {
      return this.receivedAmount >= this.total;
    }
    return this.selectedPayment !== '';
  }

  selectPayment(paymentId: string): void {
    this.selectedPayment = paymentId;
  }

  calculateChange(): void {
    this.changeAmount = this.receivedAmount - this.total;
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  conclude(): void {
    if(!this.selectedPayment){
      alert('Selecione um método de pagamento.');
    }
    this.onConclude.emit({
      paymentMethod: this.selectedPayment,
    });
    this.close();
  }
}