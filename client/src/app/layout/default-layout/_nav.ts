import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    title: true,
    name: 'Gerencial'
  },
  {
    name: 'Vendas',
    url: '/sale',
    iconComponent: { name: 'cil-calculator' },
    permission: ['ADMIN', 'MANAGER','EMPLOYEE']

  },
  {
    name: 'Produtos',
    url: '/products',
    iconComponent: { name: 'cil-notes' },
    permission: ['ADMIN', 'MANAGER']
  },
  {
    name: 'Funcionários',
    url: '/employee',
    iconComponent: { name: 'cil-people' },
    permission: ['ADMIN', 'MANAGER']
  },
  {
    name: 'Caixas',
    url: '/cashier',
    iconComponent: { name: 'cil-description' },
    permission: ['ADMIN', 'MANAGER']
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto',
    permission: ['MANAGER']
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/5.x/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
    permission: ['MANAGER'] // Permissão necessária para ver este item
  }
];
