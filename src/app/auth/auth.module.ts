import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { IonContent } from '@ionic/angular/standalone';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';
import { RequestLoginComponent } from './pages/request-login/request-login.component';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    CompletarRegistroComponent,
    RequestLoginComponent,
    UsersComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AuthModule { }
