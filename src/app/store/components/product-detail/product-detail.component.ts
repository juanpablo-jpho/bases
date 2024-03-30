import { Component, Input, OnInit, inject} from '@angular/core';
import { Models } from 'src/app/models/models';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent  implements OnInit {

  @Input() item: Models.Store.Item
  cantidad: number = 0;


  private carritoService  = inject(CarritoService)

  constructor() {}

  ngOnInit() {}

  addItem() {
      console.log('additem');
      this.cantidad ++;
      this.carritoService.addItem(this.item)
  }



  removeItem() {
    this.carritoService.removeItem(this.item);
    if (this.cantidad > 0) {
      this.cantidad --;
    }
  }


}
