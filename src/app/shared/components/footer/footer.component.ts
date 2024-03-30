import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit, OnDestroy {

  cant: number = 0;
  private carritoService  = inject(CarritoService);

  subscriptionCarrito: Subscription;

  constructor() { }

  ngOnInit() {
      this.cant = this.carritoService.carrito.cantidadTotal;
      this.subscriptionCarrito = this.carritoService.getCarritoChanges().subscribe( changes => {
        console.log('getCarritoChanges en footer -> ', changes);
          this.cant = changes.cantidadTotal;
      })
  }

  ngOnDestroy() {
    this.subscriptionCarrito?.unsubscribe();
  }






}
