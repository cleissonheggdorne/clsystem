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
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Produtos',
    url: '/products',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Funcionários',
    url: '/employee',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Caixas',
    url: '/cashier',
    iconComponent: { name: 'cil-drop' }
  },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/5.x/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
