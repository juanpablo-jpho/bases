import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';
import { RequestLoginComponent } from './pages/request-login/request-login.component';
import { UsersComponent } from './pages/users/users.component';
import { guards, simple, simpleConArgumentos } from '../shared/guards/guards';

const routes: Routes = [
  // {path: 'login', component: LoginComponent},
  // {path: 'request-login', component: RequestLoginComponent},
  // {path: 'registro', component: RegistroComponent},
  // {path: 'completar-registro', component: CompletarRegistroComponent},
  // // {path: 'perfil', component: PerfilComponent, canActivate: [simple]},
  // // {path: 'perfil', component: PerfilComponent, canActivate: [simpleConArgumentos('hola')]},
  // {path: 'perfil', component: PerfilComponent, canActivate: [guards.simpleConArgumentos('hola')]},
  // // {path: 'perfil', component: PerfilComponent, canActivate: [guards.isLogin()]},
  // {path: 'admin', component: UsersComponent}

  {path: 'login', component: LoginComponent, canActivate: [guards.notLogin()]},
  {path: 'request-login', component: RequestLoginComponent},
  {path: 'registro', component: RegistroComponent, canActivate: [guards.isLogin()]},
  {path: 'completar-registro', component: CompletarRegistroComponent, canActivate: [guards.isLogin()]},
  {path: 'perfil', component: PerfilComponent, canActivate: [guards.isLogin('user/login')]},
  {path: 'admin', component: UsersComponent, canActivate: [guards.isRol(['admin'])]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

