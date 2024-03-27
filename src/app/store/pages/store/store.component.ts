import { Component, OnInit } from '@angular/core';
import { Models } from 'src/app/models/models';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent  implements OnInit {


  
  carrito: Models.Store.Carrito;
  items: Models.Store.Item[];
  pedidos: Models.Store.Pedido[];



  constructor() { }

  ngOnInit() {}

}
