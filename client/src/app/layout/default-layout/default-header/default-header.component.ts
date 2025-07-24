import { NgStyle, NgTemplateOutlet, NgClass, DatePipe, AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective,
  ToastComponent,
  ToasterComponent
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { CashierService, CashierStatus, CashierSummary } from '../../../service/cashier.service';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';
import { CustomModalComponent } from '../../../shared/components/custom-modal/custom-modal.component';
import { CashierSummaryModalComponent } from '../../../shared/components/cashier-summary-modal/cashier-summary-modal.component';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    ContainerComponent, 
    HeaderTogglerDirective, 
    SidebarToggleDirective, 
    IconDirective, 
    HeaderNavComponent, 
    NavItemComponent, 
    NavLinkDirective, 
    RouterLink, 
    RouterLinkActive, 
    NgTemplateOutlet, 
    BreadcrumbRouterComponent, 
    ThemeDirective, 
    DropdownComponent, 
    DropdownToggleDirective, 
    TextColorDirective, 
    AvatarComponent, 
    DropdownMenuDirective, 
    DropdownHeaderDirective, 
    DropdownItemDirective, 
    BadgeComponent, 
    DropdownDividerDirective, 
    ProgressBarDirective, 
    ProgressComponent, 
    NgStyle,
    NgClass,
    NgIf,
    DatePipe,
    AsyncPipe,
    CustomModalComponent,
    CashierSummaryModalComponent,
    ToasterComponent
  ]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  // Informações do caixa
  cashierStatus$: Observable<CashierStatus>;
  
  // Informações do usuário
  currentEmployee: any;

  //Fechar Caixa
  modalCloseCashier = false;
  modalCloseCashierTitle = "Fechar Caixa"
  modalCloseCashierDescription = "Você tem certeza que deseja fechar o caixa?"; 

  // Abrir Caixa
  modalOpenCashier = false;

  modalFieldsOpenCashier = [
    {
      type: 'number',
      label: 'Digite o valor atual do caixa',
      key: 'valor',
      required: true,
      disabled: false,
      placeholder: 'Informe o valor'
    }
  ];

  // Abrir Caixa
  modalAlterPassword = false;

  modalFieldsAlterPassword = [
    {
      type: 'password',
      label: 'Digite a senha atual',
      key: 'passwordOld',
      required: true,
      disabled: false,
      placeholder: ''
    },
    {
      type: 'password',
      label: 'Digite a nova senha',
      key: 'passwordNew',
      required: true,
      disabled: false,
      placeholder: ''
    },
    {
      type: 'password',
      label: 'Digite a nova senha',
      key: 'passwordNew2',
      required: true,
      disabled: false,
      placeholder: ''
    },
  ];

  // Modal de resumo
  isLoading = false;
  summaryModalVisible = false;
  summaryData: CashierSummary[] = [];

  constructor(
    private cashierService: CashierService,
    private loginService: LoginService
  ) {
    super();
    this.cashierStatus$ = this.cashierService.cashierStatus$;
    this.currentEmployee = this.getEmployeeFromLocalStorage();
  }

  ngOnInit(): void {
    // Atualizar o status do caixa
    this.cashierService.checkCashierStatus();
  }

  // Método para logout
  logout(): void {
    this.loginService.logout();
    // Adicionar redirecionamento para página de login, se necessário
    window.location.href = '/login';
  }

  // Método para obter informações do funcionário do localStorage
  getEmployeeFromLocalStorage(): any {
    try {
      const employeeStr = localStorage.getItem('employee');
      return employeeStr ? JSON.parse(employeeStr) : null;
    } catch (error) {
      console.error('Erro ao obter funcionário do localStorage:', error);
      return null;
    }
  }

  toggleCashier() {
    this.cashierStatus$.subscribe(status => {
      if (status.isOpen && status.cashierData) {
        this.resumeByCashier(status.cashierData.idCashier);
       // this.modalCloseCashier = true;
      } else {
        this.modalOpenCashier = true;
      }
    }).unsubscribe(); 
  }

  resumeByCashier(id: number): void {
    this.isLoading = true;
    this.cashierService.fetchSummaryByCashier(id).subscribe({
      next: (summary) => {
        this.summaryData = summary;
        this.summaryModalVisible = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.isLoading = false;
      }
    });
  }
  closeCashier(){
    this.cashierService.closeCashier().subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Erro ao fechar o caixa:', error);
      },complete: () => {
         this.summaryModalVisible = false;
      }
    });
  }

  openCashier(data: any){
    this.cashierService.openCashier(data.valor).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Erro ao abrir o caixa:', error);
      },complete: () => {
        this.modalOpenCashier = false; // Fechar o modal após fechar o caixa
      }
    });
  }

  alterPassword(values: any){
    if(this.modalAlterPassword == false){
      this.modalAlterPassword = true;
      return;
    }

    if(values.passwordNew !== values.passwordNew2){
      alert('As senhas não conferem');
    }

    this.loginService.alterPassword(values.passwordOld, values.passwordNew).subscribe({
      next: () => {
      },
      error: (error) => {
        if( error.status === 400) {
          alert('Senha atual incorreta');
          return;
        }
        console.error('Erro ao alterar a senha:', error);
      },complete: () => {
        this.modalAlterPassword = false; // Fechar o modal
      }
    });

  }

  prepareForOpenCashier() {
    
  }

  prepareForCloseCashier() {
    this.cashierService.closeCashier();
  }

  sidebarId = input('sidebar1');

  // public newMessages = [
  //   {
  //     id: 0,
  //     from: 'Jessica Williams',
  //     avatar: '7.jpg',
  //     status: 'success',
  //     title: 'Urgent: System Maintenance Tonight',
  //     time: 'Just now',
  //     link: 'apps/email/inbox/message',
  //     message: 'Attention team, we\'ll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...'
  //   },
  //   {
  //     id: 1,
  //     from: 'Richard Johnson',
  //     avatar: '6.jpg',
  //     status: 'warning',
  //     title: 'Project Update: Milestone Achieved',
  //     time: '5 minutes ago',
  //     link: 'apps/email/inbox/message',
  //     message: 'Kudos on hitting sales targets last quarter! Let\'s keep the momentum. New goals, new victories ahead...'
  //   },
  //   {
  //     id: 2,
  //     from: 'Angela Rodriguez',
  //     avatar: '5.jpg',
  //     status: 'danger',
  //     title: 'Social Media Campaign Launch',
  //     time: '1:52 PM',
  //     link: 'apps/email/inbox/message',
  //     message: 'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...'
  //   },
  //   {
  //     id: 3,
  //     from: 'Jane Lewis',
  //     avatar: '4.jpg',
  //     status: 'info',
  //     title: 'Inventory Checkpoint',
  //     time: '4:03 AM',
  //     link: 'apps/email/inbox/message',
  //     message: 'Team, it\'s time for our monthly inventory check. Accurate counts ensure smooth operations. Let\'s nail it...'
  //   },
  //   {
  //     id: 3,
  //     from: 'Ryan Miller',
  //     avatar: '4.jpg',
  //     status: 'info',
  //     title: 'Customer Feedback Results',
  //     time: '3 days ago',
  //     link: 'apps/email/inbox/message',
  //     message: 'Our latest customer feedback is in. Let\'s analyze and discuss improvements for an even better service...'
  //   }
  // ];

  // public newNotifications = [
  //   { id: 0, title: 'New user registered', icon: 'cilUserFollow', color: 'success' },
  //   { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
  //   { id: 2, title: 'Sales report is ready', icon: 'cilChartPie', color: 'info' },
  //   { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
  //   { id: 4, title: 'Server overloaded', icon: 'cilSpeedometer', color: 'warning' }
  // ];

  // public newStatus = [
  //   { id: 0, title: 'CPU Usage', value: 25, color: 'info', details: '348 Processes. 1/4 Cores.' },
  //   { id: 1, title: 'Memory Usage', value: 70, color: 'warning', details: '11444GB/16384MB' },
  //   { id: 2, title: 'SSD 1 Usage', value: 90, color: 'danger', details: '243GB/256GB' }
  // ];

  // public newTasks = [
  //   { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
  //   { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
  //   { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
  //   { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
  //   { id: 4, title: 'Angular Version', value: 100, color: 'success' }
  // ];

}
