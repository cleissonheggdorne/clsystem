import { Component } from '@angular/core';
import {
  RowComponent,
  CardComponent,
  ColComponent,
  CardBodyComponent,
  TableDirective
} from '@coreui/angular';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RowComponent,
            CardComponent,
             ColComponent,
             CardBodyComponent,
             TableDirective],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userTypes: any = [];
  users: User[] = [];
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Carrega os usuários da API
  loadUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      console.log(data);
      this.users = data;
    });
  }

 // Remove o usuário
 removeUser(id: string) {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
      });
    }
  }

  // Função para editar o usuário (redirecionar para o formulário de edição)
  editUser(id: string) {
    // Redirecionar para a página de edição de usuário (configuração do roteamento necessária)
    // Exemplo: this.router.navigate([`/edit-user/${id}`]);
  }
}
