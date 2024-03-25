import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { IonContent } from '@ionic/angular/standalone';
import { ContactComponent } from './pages/contact/contact.component';
import { FormContactComponent } from './components/form-contact/form-contact.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FormContactComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule,
    IonContent
  ]
})
export class ContactModule { }
