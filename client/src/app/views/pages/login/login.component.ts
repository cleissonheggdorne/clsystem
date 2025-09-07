import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular'; 
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, ToasterService, AlertComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

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
        RouterModule,
        AlertComponent,
        NgxMaskDirective
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
})
export class LoginComponent {
  loginForm: FormGroup;
  alertAuthvisible = false;
  alertAuthMessage = 'Dados Inválidos. Tente Novamente.';
  alertAuthDismissible = false;
  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private router: Router,
    private route: ActivatedRoute,    
    private toasterService: ToasterService
  ) {  
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],//, Validators.email
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.verifyToken();
    this.verifyRegistered();
  }
  verifyRegistered(){
    const registered = this.route.snapshot.queryParamMap.get('registered');
    if(registered === 'true'){
      this.alertAuthMessage = 'Verifique seu email para ativar sua conta.';
      this.alertAuthvisible = true;
    }
  } 

  verifyToken() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if(token){
      this.alertAuthMessage = 'Verificando email...';
      this.alertAuthvisible = true;
      this.loginService.verifyToken(token).subscribe({
        next: (response) => {
          this.alertAuthMessage = 'Email verificado com sucesso! Faça o login agora mesmo.';
        },
        error: (error) => {
          this.alertAuthMessage = 'Ocorreu uma falha na verificação: ' + error.error.message;
        }
      });
    }
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
          // console.error('Erro ao fazer login:', error);
          if(error.status == 403 && error.error.error == "EMAIL_NOT_VERIFIED"){
            this.alertAuthMessage = error.error.message;
          }else{
            this.alertAuthMessage = 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.';
          }
          this.alertAuthvisible = true;
        }      
      });
    }
  }
}
