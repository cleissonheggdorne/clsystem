import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular'; 
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, ToasterService, AlertComponent, SpinnerComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize } from 'rxjs/internal/operators/finalize';

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
        NgxMaskDirective,
        SpinnerComponent
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
})
export class LoginComponent {
  loginForm: FormGroup;
  alertAuthvisible = false;
  alertAuthMessage = 'Dados Inválidos. Tente Novamente.';
  alertAuthDismissible = false;
  _loading = false;
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
  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    if (this._loading) {
      this.loginForm.disable(); // Desabilita todos os campos do formulário
    } else {
      this.loginForm.enable();  // Habilita todos os campos do formulário
    }
  }
  verifyToken() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if(token){
      this.alertAuthMessage = 'Verificando email...';
      this.alertAuthvisible = true;
      this.loading = true;
      this.loginService.verifyToken(token).
      pipe(
          finalize(() => { //Executa independente do resultado
            this.loading = false; 
          })
      )
      .subscribe({
        next: () => {
          this.alertAuthMessage = 'Email verificado com sucesso! Faça o login agora mesmo.';
        },
        error: (error) => {
          // console.error('Erro ao fazer login:', error);
          if(error.status == 400 && error.error.error == "TOKEN_ALREADY_USED"){
            this.alertAuthMessage = error.error.message;
          }else{
            this.alertAuthMessage = 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.';
          }
          this.alertAuthvisible = true;
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
      this.loading = true;
      this.loginService.login(this.username?.value, this.password?.value).subscribe({
        next: () => {
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
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
