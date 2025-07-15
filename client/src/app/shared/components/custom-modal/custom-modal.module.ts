import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ButtonModule, 
  FormModule, 
  ModalModule 
} from '@coreui/angular';

import { CustomModalComponent } from './custom-modal.component';

@NgModule({
  declarations: [
    CustomModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FormModule,
    ModalModule
  ],
  exports: [
    CustomModalComponent
  ]
})
export class CustomModalModule { }