import { Component, Input, OnInit, inject} from '@angular/core';
import { Models } from 'src/app/models/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { AnalyticsService } from '../../../firebase/analytics.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent  implements OnInit {

  @Input() item: Models.Store.Item

  cantidad: number = 0;
  color: 'aliceblue' | '#fde2e2' | '#dfe7d6' = 'aliceblue';

  private carritoService  = inject(CarritoService)
  private analyticsService  = inject(AnalyticsService)

  constructor() {}

  ngOnInit() {
    this.getColor();
  }

  addItem() {
      console.log('additem');
      this.cantidad ++;
      this.carritoService.addItem(this.item)
      this.analyticsService.registerEvent('add_item', {value: this.item.price, nameItem: this.item.name})
  }



  removeItem() {
    this.carritoService.removeItem(this.item);
    if (this.cantidad > 0) {
      this.cantidad --;
    }
  }

  getColor() {
    if (this.item.stock == 0) {
      this.color = '#fde2e2';
    } else if (this.item.stock < 5) {
      this.color = 'aliceblue';
    } else { 
      this.color = '#dfe7d6' ;
    }
  }


}
