import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormFeedbackComponent, SpinnerComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer, Employee, EmployeeService } from '../../../service/employee.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../service/login.service'; 
import { NgIf, NgClass } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent,
       RowComponent, 
       ColComponent, 
       TextColorDirective, 
       CardComponent, 
       CardBodyComponent, 
       FormDirective, 
       InputGroupComponent, 
       InputGroupTextDirective, 
       IconDirective, 
       FormControlDirective, 
       ButtonDirective,
      ReactiveFormsModule,NgIf, NgClass,
    FormFeedbackComponent,
  NgxMaskDirective,
  SpinnerComponent]
})
export class RegisterComponent {

  registerForm: FormGroup;

  stepEmployee = false;
  stepCustomer = true;

  _loading = false;

  constructor(private fb: FormBuilder,     
    private loginService: LoginService,
    private router: Router 
    
  ) {
    this.registerForm = this.fb.group({
      nameCustomer: ['', [Validators.required, Validators.maxLength(200)]],
      documentCustomer: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(18)]],
      email:['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      confirmDemo: [false, Validators.required]
    });
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    if (this._loading) {
      this.registerForm.disable(); // Desabilita todos os campos do formulário
    } else {
      this.registerForm.enable();  // Habilita todos os campos do formulário
    }
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get nameCustomer(){
    return this.registerForm.get('nameCustomer');
  }

  get documentCustomer(){
    return this.registerForm.get('documentCustomer');
  }

  onSubmit() {
    if (this.registerForm.valid
      && this.password?.value === this.repeatPassword?.value
    ) {
      
      const customer: Customer = {
        idCustomer: '',
        name: this.nameCustomer?.value,
        document: this.documentCustomer?.value,
        email: this.email?.value,
        password: this.password?.value
      };
      this.loading = true;
      this.loginService.register(customer)
      .pipe(
        finalize(() => { //Executa independente do resultado
          this.loading = false; 
        })
      ).subscribe({
        next: (response) => {
            this.loginService.setEmployee(response);
            this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        error: (error) => {
          const mensagem = error.error?.body || error.error || 'Erro ao salvar usuário. Verifique os dados e tente novamente.';
          alert('Erro ao registrar usuário: ' + mensagem);
        }
      });
    }else{
      alert('Verifique os dados e tente novamente');
    }
  }

}
