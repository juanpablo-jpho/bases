import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { RouterModule } from '@angular/router';
import { DetailCarritoComponent } from './components/detail-carrito/detail-carrito.component';
import { ShortPipe } from './pipes/short.pipe';
import { FiletourlPipe } from './pipes/filetourl.pipe';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    DetailCarritoComponent,
    ShortPipe,
    FiletourlPipe
  ],
  imports: [
    CommonModule,
    NotificationsModule,
    RouterModule,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    DetailCarritoComponent,
    ShortPipe,
    FiletourlPipe
  ]
})
export class SharedModule { }
