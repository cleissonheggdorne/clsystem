import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ButtonModule, 
  FormModule,
  ModalModule 
} from '@coreui/angular';
export interface ModalField {
  type: string;
  label: string;
  key: string;
  value?: any;
  disabled: boolean;
  options?: { value: any; label: string }[];
  placeholder?: string;
  required: boolean;
}

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FormModule,
    ModalModule
  ],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class CustomModalComponent {
  @Input() visible: boolean = false;
  @Input() title = '';
  @Input() description = '';
  @Input() fields: ModalField[] = [];
  @Input() data: any = {};
  @Input() primaryButtonText = 'Salvar';
  @Input() secondaryButtonText = 'Cancelar';
  @Input() showSecondaryButton = true;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() primaryAction = new EventEmitter<any>();
  @Output() secondaryAction = new EventEmitter<void>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onPrimaryAction(): void {
    this.primaryAction.emit(this.data);
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
    this.closeModal();
  }
}