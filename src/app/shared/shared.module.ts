import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsModule } from '../notifications/notifications.module';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NotificationsModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent
    
  ]
})
export class SharedModule { }
