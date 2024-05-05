import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirestoreService } from './firebase/firestore.service';
import { Models } from './models/models';
import { arrayRemove, average, count, deleteField, increment, sum } from '@angular/fire/firestore';
import { AuthenticationService } from './firebase/authentication.service';
import { UserService } from './services/user.service';
import { WebService } from './services/web.service';
import { AnalyticsService } from './firebase/analytics.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private firestoreService = inject(FirestoreService);
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private userService: UserService = inject(UserService);
  private webService: WebService = inject(WebService);
  private analyticsService: AnalyticsService = inject(AnalyticsService);
  
  constructor() {
    // this.saveProduct();
    // this.updateProduct();
    // this.deleteProduct();
    // this.getProduct();
    // this.getProducts();
    // this.consultar();
    // this.getAggregate();
    // this.registrarse()
    // this.login() 
    // this.helloWorld();

  }

  async helloWorld() {
    const url = 'http://127.0.0.1:5001/basesfire/us-central1';

    const data = {
      num1: 5,
      num2: 10
    }
    const response = await this.webService.request('POST', url, 'helloWorld', data);
    console.log('response -> ', response);
    
  }
  




  async registrarse() {
    const form = {email: 'juan@gmail.com', password: '123456'};
    console.log('registrarse -> ', form);
    if (form.email && form.password) {
      const user = await this.authenticationService.createUser(form.email, form.password)
      console.log('user -> ', user);
    }
  }

  async login() {
    const form = {email: 'juan@gmail.com', password: '1234568585'};
    console.log('login -> ', form);
    if (form?.email && form.password) {
      const user = await this.authenticationService.login(form.email, form.password)
      console.log('user -> ', user);
    }
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
    // try {
      await this.firestoreService.createDocument<Models.Store.Item>('Products', data)
    //   console.log('guardado con éxito');
    // } catch (error) {
    //   console.log('error el guardar -> ', error);
    // }
  }


  async updateProduct() {
    console.log('updateProduct()');
    const path = '/Products/SKlkf0ApThxRdsrwsJAU';
    const updateDoc = {
      stock: increment(3)
    }
    try {
      await this.firestoreService.updateDocument(path, updateDoc)
      console.log('actualizado con éxito');
    } catch (error) {
      console.log('error al actualizar -> ', error);
    }
  }

  async deleteProduct() {
    console.log('deleteProduct()');
    const path = '/Products/SKlkf0ApThxRdsrwsJAU';
    try {
      await this.firestoreService.deleteDocument(path)
      console.log('eliminado con éxito');
    } catch (error) {
      console.log('error al eliminar -> ', error);
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
    
    // const path = '/Products/58HZshMatIOqiNVXUd9o';
    const path = '/Products/lyhNDOPAb4jhOjfPzltd'
    // const doc = await this.firestoreService.getDocument<Models.Store.Item>(path);
    // if (doc.exists()) {
    //   console.log('docSnap.data() -> ', doc.data());
    // }

    this.firestoreService.getDocumentChanges<Models.Store.Item>(path).subscribe( res => {
       console.log('getProduct -> ', res);

    });


  }

  async getProducts() {
    console.log('getProducts()');
    const path = 'Users';
    // const path = '/Users/8njXZ7n0GuhJyi1ysXO9/pedidos'
    // const path = "pedidos"

    // const docs = await this.firestoreService.getDocuments<Models.Store.Item>(path, true);
    // docs.forEach((doc) => {
    //     console.log(doc.id, ' => ', doc.data());
    // });

    const s = this.firestoreService.getDocumentsChanges<Models.Store.Item>(path).subscribe( changes => {
      console.log('Products -> ', changes);
      // console.log('pedidos -> ', changes);
      
    });
    // s.unsubscribe();
  }

  async consultar() {
    console.log('consultar()');
    const path = 'Products';
    // const path = 'pedidos';
    let q: Models.Firebase.whereQuery[];
    q = [ ['enable', '==', true] ];

    // q = [['enable', '==', true, 'salty', '==', true], ['name', '==', 'Water']];
    // q = [ ['name', 'in', ['Hotdog', 'Fish']]];
    // q = [ ["price", ">=", 0, "price", "<=", 6]];
    // q = [ ['state', '==', 'new']];
    // q = [ ['user.id', '==', '8njXZ7n0GuhJyi1ysXO9']];

    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'price', 
      // directionSort: 'desc', 
      // limit: 2,
      // group: true
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

}


