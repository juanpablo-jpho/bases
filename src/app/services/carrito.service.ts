import { Injectable } from '@angular/core';
import { Models } from '../models/models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito$ = new Subject<Models.Store.Carrito>()
  carrito: Models.Store.Carrito;

  constructor() { 
    this.initCarrito();
  }

  private initCarrito() {
    this.carrito = {
      total: 0,
      cantidadTotal: 0,
      items: [],
    } 
    console.log('this.carrito -> ', this.carrito);

    
  }

  getCarritoChanges() {
    return this.carrito$.asObservable();
  }

  addItem(item: Models.Store.Item) {
    // console.log('addItem ', item);
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
      // console.log('getTotal()');
      let total = 0;
      let cantidad = 0;
      this.carrito.items.forEach( producto => {
            total = total + (producto.item.price * producto.cant);
            cantidad = cantidad + producto.cant
      });
      this.carrito.total = total;
      this.carrito.cantidadTotal = cantidad;
      // console.log('this.carrito ->', this.carrito);
      this.carrito$.next(this.carrito)
      return this.carrito.total
  }

  removeItem(item: Models.Store.Item) {
    // console.log('removeItem -> ', item);
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


}
