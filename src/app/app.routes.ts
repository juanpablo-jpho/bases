import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then((m) => m.StoreModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then((m) => m.ContactModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    // redirectTo: '',
    // pathMatch: 'full',
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
