import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, ToasterService } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        ContainerComponent, 
        RowComponent, 
        ColComponent, 
        CardGroupComponent, 
        TextColorDirective, 
        CardComponent, 
        CardBodyComponent, 
        FormDirective, 
        InputGroupComponent, 
        InputGroupTextDirective, 
        IconDirective, 
        FormControlDirective, 
        ButtonDirective, 
        NgStyle,
        ReactiveFormsModule,
        RouterModule
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
})
export class LoginComponent {
  loginForm: FormGroup;
  alertAuthvisible = false;
  alertAuthDismissible = false;
  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private router: Router,    
    private toasterService: ToasterService
  ) {  
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],//, Validators.email
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.username?.value, this.password?.value).subscribe({
        next: (response) => {
          this.router.navigate(['/sale']);
        },
        error: (error) => {
          //console.error('Erro ao fazer login:', error);
          this.alertAuthvisible = true;
        }      
      });
    }
  }
}
