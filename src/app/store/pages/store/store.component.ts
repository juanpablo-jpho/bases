import { Component, OnInit, inject } from '@angular/core';
import { Models } from 'src/app/models/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent  implements OnInit {

  items: Models.Store.Item[];
  cargando: boolean = true;
  carrito: Models.Store.Carrito;
  cantidad: number;

  tituloPagina = 'Tienda';

  private databaseService = inject(DatabaseService)
  private carritoService  = inject(CarritoService)

  constructor() {
    this.loadItems();
  }

  ngOnInit() {

      this.carrito = this.carritoService.carrito;
      this.carritoService.getCarritoChanges().subscribe( changes => {
            console.log('getCarritoChanges en store -> ', changes);
            this.carrito = changes;
      });

  }

  loadItems() {
      this.databaseService.getData('items')
      setTimeout(() => {
        this.items = DataDemo;
        this.cargando = false;
        console.log('items -> ', this.items);      
      }, 2000);
  }


  addItem(item: Models.Store.Item) {
      // this.carritoService.addItem(item);
      // this.carrito = this.carritoService.carrito;
  }

  removeItem(item: Models.Store.Item) {
      // this.carritoService.removeItem(item);
      // this.carrito = this.carritoService.carrito;
  }

  onClick() {
    console.log('onClick()');
    
  }


  validateInput() {
    console.log('validateInput()');
    
  }

  updateInput(ev: any) {
    console.log('updateInput -> ', ev);
    
  }
 
}


const DataDemo: Models.Store.Item[] = [
  {
    id: '0001',
    name: 'Hamburguesa',
    description: 'Con queso, salsas, papas',
    price: 7.50,
    image: '/assets/images/hamburguesa.webp'
  },
  {
    id: '0002',
    name: 'Hamburguesa Especial',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero maxime asperiores ex quia, nostrum laboriosam recusandae ea eaque explicabo cupiditate iure quo omnis aliquid beatae soluta odit aliquam. Velit, voluptate.',
    price: 9.50,
    // image: '/assets/images/hamburguesa.webp'
  },
  {
    id: '0003',
    name: 'Hamburguesa Doble',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero maxime asperiores ex quia, nostrum laboriosam recusandae ea eaque explicabo cupiditate iure quo omnis aliquid beatae soluta odit aliquam. Velit, voluptate.',
    price: 11.50,
    image: '/assets/images/hamburguesa.webp'
  }
];