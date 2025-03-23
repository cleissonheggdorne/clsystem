import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isLoggedIn()) {
      return true; // Permite o acesso à rota
    } else {
      this.router.navigate(['/login']); // Redireciona para a página de login
      return false; // Bloqueia o acesso à rota
    }
  }
}