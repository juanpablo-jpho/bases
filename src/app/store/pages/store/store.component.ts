import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { DatabaseService } from 'src/app/services/database.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent  implements OnInit {

  items: Models.Store.Item[];

  carrito: Models.Store.Carrito;
  cantidad: number;
  tituloPagina = 'Tienda';

  private firestoreService = inject(FirestoreService);

  cargando: boolean = true;
  categorias = [
                {name: 'Fast Food', id: 'fastfood'}, 
                {name: 'Drinks', id: 'Drinks'},
                {name: 'Seafood', id: 'Seafood'}
              ]
  categoriaSelected: string = 'fastfood'; 
  enableMore: boolean = true;             



  constructor(private title: Title) {
    // this.loadItems();
    this.getProductsByCategoria();
  }



  ngOnInit() {

  }

  ionViewDidEnter() {
    this.title.setTitle('Tienda')
  }

  loadItems() {
      setTimeout(() => {
        this.items = DataDemo;
        this.cargando = false;
        // console.log('items -> ', this.items);      
      }, 2000);
  }

  async consultar() {
    console.log('consultar()');
    const path = 'Products';
    let q: Models.Firebase.whereQuery[];
    q = [['enable', '==', true]];

    // q = query(refCollection, where('name', 'in', ['Hotdog', 'Fish']));
    // q = [ ['name', 'in', ['Hotdog', 'Fish']]];

    // q = query(refCollection, where("price", ">=", 10), where("price", "<=", 20));
    // q = [ ["price", ">=", 0, "price", "<=", 6]];

    // const q = query(refCollection, where("categories", 'array-contains-any', ['fastfood', 'Drinks']));
    // q = [["categories", 'array-contains', 'fastfood']];
    // q = [["categories", 'array-contains-any', ['fastfood', 'Drinks']]];
    // q = [[ 'date'  ]]

    const extras: Models.Firebase.extrasQuery = {
      orderParam: 'date', 
      directionSort: 'asc', 
      limit: 2,
    }

    if (this.items) {
      const last = this.items[ this.items.length - 1 ];
      const snapDoc = await this.firestoreService.getDocument(`${path}/${last.id}`)
      extras.startAfter = snapDoc
    }

    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>(path, q, extras).subscribe( res => {
      console.log('res -> ', res);
      if (this.items) {
        res.forEach( itemNew => {
            const exist = this.items.findIndex( item => { return item.id === itemNew.id})
            if (exist >=0 ) {
              this.items[exist] = itemNew
            } else {
              this.items.push(itemNew);
            }
        });
      } else {
        this.items = res;
      }
      this.cargando = false;
    });
  }

  async getProductsByCategoria(id: string = this.categoriaSelected) {

    if (this.categoriaSelected != id) {
      this.items = null;
      this.cargando = true;
      this.enableMore = true
    }


    this.categoriaSelected = id
    console.log('getProductsByCategoria -> ', id);
    const path = 'Products';
    const numItems = 2;
    let q: Models.Firebase.whereQuery[];
    q = [["categories", 'array-contains', id]];
    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'date', 
      // directionSort: 'asc', 
      limit: numItems,
    }

    if (this.items) {
      const last = this.items[ this.items.length - 1 ];
      const snapDoc = await this.firestoreService.getDocument(`${path}/${last.id}`)
      extras.startAfter = snapDoc
    }

    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>(path, q, extras).subscribe( res => {
      console.log('res -> ', res);
      if (res.length) {
        if (res.length < numItems) {
          this.enableMore = false
        }
  
        if (this.items) {
           res.forEach( itemNew => {
              const isSameCategoria = itemNew.categories.find( categoria => { return this.categoriaSelected == categoria});
              if (isSameCategoria) {            
              const exist = this.items.findIndex( item => { return item.id === itemNew.id})
              if (exist >=0 ) {
                  this.items[exist] = itemNew
              } else {
                  this.items.push(itemNew);
              }
            }
  
          });
        } else {
          this.items = res;
        }
      }
      this.cargando = false;
    });
  }

 
}


const DataDemo: Models.Store.Item[] = [
  {
    id: '0001',
    name: 'Hamburguesa',
    description: 'Con queso, salsas, papas',
    price: 7.50,
    image: '/assets/images/hamburguesa.webp',
    stock: 0,
    categories: [],
    enable: true,
  },
  {
    id: '0002',
    name: 'Hamburguesa Especial',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero maxime asperiores ex quia, nostrum laboriosam recusandae ea eaque explicabo cupiditate iure quo omnis aliquid beatae soluta odit aliquam. Velit, voluptate.',
    price: 9.50,
    // image: '/assets/images/hamburguesa.webp'
    stock: 0,
    categories: [],
    enable: true,
  },
  {
    id: '0003',
    name: 'Hamburguesa Doble',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero maxime asperiores ex quia, nostrum laboriosam recusandae ea eaque explicabo cupiditate iure quo omnis aliquid beatae soluta odit aliquam. Velit, voluptate.',
    price: 11.50,
    image: '/assets/images/hamburguesa.webp',
    stock: 10,
    categories: [],
    enable: true,
  }
];