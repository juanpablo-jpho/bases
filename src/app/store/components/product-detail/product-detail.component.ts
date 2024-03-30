import { Component, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import { Models } from 'src/app/models/models';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent  implements OnInit {

  @Input() item: Models.Store.Item
  @Input() index: number;

  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();

  cantidad: number = 0;

  private carritoService  = inject(CarritoService)

  constructor() {}

  ngOnInit() {
    // console.log('item -> ', this.item);
  }

  addItem() {
      console.log('additem');
      this.add.emit()
      this.cantidad ++;
      this.carritoService.addItem(this.item)

  }



  removeItem() {
    this.remove.emit()
    this.carritoService.removeItem(this.item);
    if (this.cantidad > 0) {
      this.cantidad --;
    }
  }


}
