import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { IconNotificationComponent } from './components/icon-notification/icon-notification.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { DetailNotificationComponent } from './components/detail-notification/detail-notification.component';
import { IonContent } from '@ionic/angular/standalone';

@NgModule({
  declarations: [
    NotificationsComponent,
    IconNotificationComponent,
    DetailNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    IonContent
  ],
  exports: [
    IconNotificationComponent
  ]
})
export class NotificationsModule { }
