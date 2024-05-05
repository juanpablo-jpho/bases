import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './pages/store/store.component';
import { ProductComponent } from './pages/product/product.component';

const routes: Routes = [
  {path: 'home', component: StoreComponent},
  {path: 'item/:enlace', component: ProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
