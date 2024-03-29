import { Component, OnInit } from '@angular/core';
import { Models } from 'src/app/models/models';


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


  constructor() {
    this.loadItems();
    this.initCarrito();
  }

  ngOnInit() {}

  loadItems() {
      setTimeout(() => {
        this.items = DataDemo;
        this.cargando = false;
        console.log('items -> ', this.items);      
      }, 2000);
  }

  initCarrito() {
    this.carrito = {
      total: 0,
      cantidadTotal: 0,
      items: [],
    } 
    console.log('this.carrito -> ', this.carrito);
    
  }


  addItem(item: Models.Store.Item, index: number) {
    console.log('addItem ', item.price, index);
    let exist = false;
    this.carrito.items.every( (itemExist) => {
      console.log('itemExist -> ', itemExist);     
        if (itemExist?.item?.id == item?.id) {
          itemExist.cant ++;
          exist = true;
          return false;
        }
        return true;
    });
    if (!exist) {
      this.carrito.items.push({
          item: item,
          cant: 1
        }
      );
    }
    this.getTotal();
  }

  getTotal() {
    console.log('getTotal()');
    
    let total = 0;
    let cantidad = 0;
    this.carrito.items.forEach( producto => {
          total = total + (producto.item.price * producto.cant);
          cantidad = cantidad + producto.cant
    });
    this.carrito.total = total;
    this.carrito.cantidadTotal = cantidad;
    console.log('this.carrito ->', this.carrito);
    
    console.log();
    
  }

  removeItem(item: Models.Store.Item) {
    console.log('removeItem -> ', item);
    const exist = this.carrito.items.findIndex( (itemExist) => {
        if (itemExist.item.id == item.id) {
          return true;
        }
        return false;
    })
    if (exist >= 0) {
      console.log('exist -> ', exist);
      if (this.carrito.items[exist].cant == 1) {
        this.carrito.items.splice(exist, 1);
      } else {
        this.carrito.items[exist].cant --;
      }

    }

    this.getTotal();
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