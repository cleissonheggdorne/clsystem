import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'sale',
        loadComponent: () => import('./views/pages/sale/sale/sale.component').then(m => m.SaleComponent),
        canActivate: [AuthGuard],
        data: {
          title: 'Vendas'
        }
      },
      {
        path: 'products',
        loadComponent: () => import('./views/pages/products/products.component').then(m => m.ProductsComponent),
        canActivate: [AuthGuard],
        data: {
          title: 'Produtos'
        }
      },
      {
        path: 'employee',
        loadComponent: () => import('./views/pages/employee/employee/employee.component').then(m => m.EmployeeComponent),
        canActivate: [AuthGuard],
        data: {
          title: 'Funcionários'
        }
      },
      {
        path: 'cashier',
        loadComponent: () => import('./views/pages/cashier/cashier/cashier.component').then(m => m.CashierComponent),
        canActivate: [AuthGuard],
        data: {
          title: 'Caixas'
        }
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  // {
  //   path: 'users',
  //   loadComponent: () => import('./views/pages/user/user.component').then(m => m.UserComponent),
  //   data: {
  //     title: 'User Page'
  //   }
  // },
  { path: '**', redirectTo: '404' }
];
