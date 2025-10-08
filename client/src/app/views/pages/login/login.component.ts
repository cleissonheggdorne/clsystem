import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular'; 
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, ToasterService, AlertComponent, SpinnerComponent } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize } from 'rxjs/internal/operators/finalize';
import { CustomModalComponent, ModalField } from '../../../shared/components/custom-modal/custom-modal.component';
import { LoginService } from '../../../service/login.service';

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
        SpinnerComponent,
        CustomModalComponent
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
})
export class LoginComponent {
  loginForm: FormGroup;
  alertAuthvisible = false;
  alertAuthMessage = 'Dados Inválidos. Tente Novamente.';
  alertAuthDismissible = false;
  _loading = false;

  modalResetPassword :boolean = false;
  resetPasswordModalTitle = 'Redefinir Senha';
  resetPasswordModalDescription = 'Digite seu e-mail para receber o código de verificação.';
  nameActionResetPassword = 'Enviar Código de Verificação';
  fieldsResetPassword = [
    { type: 'text', 
      label: 'E-mail', 
      key: 'email', 
      value: '',
      disabled: false, 
      placeholder: 'Digite seu e-mail', 
      required: true 
    }
  ];

  fieldsResetPasswordAfterToken = [
    { type: 'password', 
      label: 'Senha', 
      key: 'password', 
      value: '',
      disabled: false, 
      placeholder: 'Digite sua senha', 
      required: true 
    },
    { type: 'password', 
      label: 'Confirmação de Senha', 
      key: 'confirmPassword', 
      value: '',
      disabled: false, 
      placeholder: 'Confirme sua senha', 
      required: true 
    }
  ];

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
    this.verifyResetPassword();
  }

  verifyRegistered(){
    const registered = this.route.snapshot.queryParamMap.get('registered');
    if(registered === 'true'){
      this.alertAuthMessage = 'Verifique seu email para ativar sua conta.';
      this.alertAuthvisible = true;
    }
  } 

  verifyResetPassword(){
    const redefine = this.route.snapshot.queryParamMap.get('redefine');
    if(redefine === 'true'){
      this.fieldsResetPassword = this.fieldsResetPasswordAfterToken;
      this.resetPasswordModalDescription = ""
      this.nameActionResetPassword = "Redefinir Senha"
      this.modalResetPassword = true;
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
    const token = this.route.snapshot.queryParamMap.get('token')??'';
    const confirmation = this.route.snapshot.queryParamMap.get('confirmation')??false;

    if(token && confirmation){
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
        error: (error: any) => {
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

  get email() {
    return this.fieldsResetPassword[0].value;
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.username?.value, this.password?.value).subscribe({
        next: () => {
          this.router.navigate(['/sale']);
        },
        error: (error:any) => {
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

  goToResetPassword(data: any){
    const redefine = this.route.snapshot.queryParamMap.get('redefine');
    if(redefine === 'true'){
      const token = this.route.snapshot.queryParamMap.get('token')??'';
      this.goToRedefinePassword(data, token);
    } else {
      this.goToSendMailWithTokenToRedefinePassword(data);
    }

  }

  goToSendMailWithTokenToRedefinePassword(data: any){
    this.loading = true;
    this.loginService.sendMailWithTokenToRedefinePassword(data.email).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
        next: () => {
          this.modalResetPassword = false;
        },
        error: (error:any) => {
         console.error('Erro ao enviar email de redefinição de senha:', error);
        }
      });
  }

  goToRedefinePassword(data: any, token: string){
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    if(password !== confirmPassword){
      alert('Senhas não conferem');
      return;
    }
    this.loading = true;
    this.loginService.redefinePassword(password, confirmPassword, token).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
        next: () => {
          this.modalResetPassword = false;
          this.alertAuthvisible = true;
          this.alertAuthMessage = 'Senha alterada com sucesso! Faça o login agora mesmo.';
        },
        error: (error:any) => {
         console.error('Erro redefinir senha:', error);
        }
      });
  }
}
