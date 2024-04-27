import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { guards } from '../shared/guards/guards';

const routes: Routes = [
  {path: '', component: NotificationsComponent, canActivate: [guards.isLogin()],}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
