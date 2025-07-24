import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeService } from '../../../service/employee.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../service/login.service';

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
      ReactiveFormsModule]
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,     
    private loginService: LoginService,
    private router: Router 
    
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      confirmDemo: [false, Validators.required]
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get document() {
    return this.registerForm.get('document');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  onSubmit() {
    if (this.registerForm.valid
      && this.password?.value === this.repeatPassword?.value
    ) {
      const employee: Employee = {
        nameEmployee: this.name?.value,
        document: this.document?.value,
        password: this.password?.value,
        idEmployee: 0,
        initialDate: ''
      };
      
      this.loginService.register(employee).subscribe({
        next: (response) => {
             this.router.navigate(['/login']);
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
