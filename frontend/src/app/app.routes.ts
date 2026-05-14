import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () => import('./user-products/user-products.component').then((m) => m.UserProductsComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/admin-product-list.component').then((m) => m.AdminProductListComponent),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./admin/admin-product-add.component').then((m) => m.AdminProductAddComponent),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./admin/admin-product-edit.component').then((m) => m.AdminProductEditComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/admin-orders-placeholder.component').then((m) => m.AdminOrdersPlaceholderComponent),
      },
    ],
  },
  { path: 'home', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
