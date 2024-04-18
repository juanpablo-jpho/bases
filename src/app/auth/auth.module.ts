import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { IonContent } from '@ionic/angular/standalone';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    CompletarRegistroComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonContent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
