import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirestoreService } from './firebase/firestore.service';
import { Models } from './models/models';
import { arrayRemove, average, count, deleteField, increment, sum } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private firestoreService = inject(FirestoreService);
  
  constructor() {
    // this.saveProduct();
    // this.updateProduct();
    // this.deleteProduct();
    // this.getProduct();
    // this.getProducts();
    // this.consultar();
    // this.getAggregate();

  }

  async saveProduct() {
    console.log('saveDoc()');
    const data: Models.Store.Item = {
      name: 'Water',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et vel debitis nisi iusto, nulla consequuntur mollitia aliquid quo ullam, fugiat voluptatum. Nobis quae ipsum adipisci doloremque repellat cupiditate quia similique?',
      price: 1.50,
      image: 'https://url....',
      stock: 15,
      categories: ['Drinks'],
      enable: true,
      salty: null
    }
    try {
      await this.firestoreService.createDocument<Models.Store.Item>('Products', data)
      console.log('guardado con éxito');
    } catch (error) {
      console.log('error el guardar');
    }
  }


  async updateProduct() {
    console.log('updateProduct()');
    const path = '/Products/ididid/items/gCLfk8kRKNv6Lr3BfR2o';
    const updateDoc = {
      stock: deleteField()
    }
    try {
      await this.firestoreService.updateDocument(path, updateDoc)
      console.log('actualizado con éxito');
    } catch (error) {
      console.log('error al actualizar');
    }
  }



  async deleteProduct() {
    console.log('deleteProduct()');
    
    const path = '/Products/ididid/items/gCLfk8kRKNv6Lr3BfR2o';
    try {
      await this.firestoreService.deleteDocument(path)
      console.log('eliminado con éxito');
    } catch (error) {
      console.log('error al eliminar');
    }
  }

    /*

  eliminarCampo() {
    console.log('eliminarCampo()');
    const path = 'Products/' + 'id';
    const updateDoc = {
      // stock: deleteField()
    }
    this.firestoreService.updateDocument(path, updateDoc)
  }
  */



  async getProduct() {
    console.log('getProduct()');
    
    const path = 'Products/' + 'SKlkf0ApThxRdsrwsJAU';
    // const doc = await this.firestoreService.getDocument<Models.Store.Item>(path);
    // if (doc.exists()) {
    //   console.log('docSnap.data() -> ', doc.data());
    // }

    this.firestoreService.getDocumentChanges<Models.Store.Item>(path).subscribe( res => {
       console.log('res -> ', res);

    });


  }



  async getProducts() {
    console.log('getProducts()');
    const path = 'Products';
    // const path = "/Users/8njXZ7n0GuhJyi1ysXO9/pedidos"
    // const path = "pedidos"
    // const docs = await this.firestoreService.getDocuments<Models.Store.Item>(path, true);
    // docs.forEach((doc) => {
    //     console.log(doc.id, ' => ', doc.data());
    // });



    const s = this.firestoreService.getDocumentsChanges<Models.Store.Item>(path, true).subscribe( changes => {
      console.log('Products -> ', changes);
      // console.log('pedidos -> ', changes);
      
    });
    s.unsubscribe();
  }

  async consultar() {
    console.log('consultar()');
    // const path = 'Products';
    const path = 'pedidos';
    let q: Models.Firebase.whereQuery[];
    // q = [ ['enable', '==', true] ];

    // q = [['enable', '==', true, 'salty', '==', true], ['name', '==', 'Water']];

    // q = query(refCollection, where('name', 'in', ['Hotdog', 'Fish']));
    // q = [ ['name', 'in', ['Hotdog', 'Fish']]];

    // q = query(refCollection, where("price", ">=", 10), where("price", "<=", 20));
    // q = [ ["price", ">=", 0, "price", "<=", 6]];

    // const q = query(refCollectionGroup, where('state', '==', 'new'));
    // q = [ ['state', '==', 'new']];

    // const q = query(refCollectionGroup, where('user.id', '==', '8njXZ7n0GuhJyi1ysXO9'),  where('state', '==', 'new'));
    q = [ ['user.id', '==', '8njXZ7n0GuhJyi1ysXO9']];

    // q = [ ['enable', '==', true] ];
    // q = [ ['enable', '==', true, 'salty', '==', true], ['name', '==', 'Water'] ];
    // (A * B) + (C)
    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'price', 
      // directionSort: 'desc', 
      limit: 10,
      group: true
    }

    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>(path, q, extras).subscribe( res => {
      console.log('res -> ', res);
    });
  }

  async getAggregate() {
    console.log('getAggregate()');
    // const path = 'Products';
    const path = 'pedidos';
    // const totalDocs = await this.firestoreService.getCount(path, true);
    // console.log('total docs is -> ', totalDocs);

    const totalStock = await this.firestoreService.getSum(path, 'stock');
    // console.log('total stock is -> ', totalStock);

    const averagePrice = await this.firestoreService.getAverage(path, 'price');
    // console.log('average is -> ', averagePrice);

    const aggregate = {
      count: count(),
      total: sum('total.envio'),
      // average: average('stock')
    };
    let q: Models.Firebase.whereQuery[] = [[]]
    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'price', 
      // directionSort: 'desc', 
      // limit: 2,
      group: true
    }

    const values = await this.firestoreService.getAggregations(path, aggregate, q, extras);
    console.log('values -> ', values);
    
  }



    // const id = "TczI8VUi7PJ4dPeYER3c"
    // const snapDoc = await this.firestoreService.getDocument(`Products/${id}`)
    // extras.startAfter = snapDoc

}


