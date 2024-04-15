import { Component, OnInit, inject } from '@angular/core';
import { Models } from 'src/app/models/models';
import { WebService } from 'src/app/services/web.service';
import { FirestoreService } from '../../../firebase/firestore.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  private webService = inject(WebService);
  articles: Models.Home.ArticleI[];
  cargando: boolean = false;

  // private firestoreService = inject(FirestoreService);

  constructor() { }

  async ngOnInit() {

    this.getArticles();
    // this.creatArticle();
    // const res = await this.firestoreService.getDocument<{name: string}>('/Users/r0VfJPyI1gOE5ithy0rne0HVgn32')
    // if (res.exists()) {
    //   const user = res.data();
    //   console.log('res -> ', user.name); 
    // }

    // this.firestoreService.getDocumentChanges<{name: string}>('/Users/r0VfJPyI1gOE5ithy0rne0HVgn32').subscribe( res => {
    //   const user = res  
    //   console.log('getDocumentChanges -> ', user.name); 
    // });

    // // const querys: Models.Firebase.whereQuery[] = [
    // //   [{param: 'email', condition: '==', value: 'diegot@inc.com'},
    // //    {param: 'id', condition: '==', value: "r0VfJPyI1gOE5ithy0rne0HVgn32"}
    // //   ]
    // // ]

    // const querys: Models.Firebase.whereQuery[] = [
    //   ['email', '==', 'diegot@inc.com']
    // ]

    // querys[0][0]

    // // [''], ['', ''] 

  
    // this.firestoreService.getCollectionQuery('Users', querys, {limit: 2}).subscribe( res => {
    //   console.log('getCollectionQuery -> ', res);
    // });

    // this.firestoreService.count('Users').then( res => {
    //   console.log('count -> ', res);
    // })

    // this.firestoreService.sum('Users', 'edad');

    // const docs = await this.firestoreService.getCollection<{name: string}>('Users');
    // docs.forEach( doc => {
      
    // });



  }

  async getArticles() {
    this.cargando = true;
    const url = 'https://jsonplaceholder.typicode.com';
    const res = await this.webService.request<Models.Home.ArticleI[]>('GET', url, 'posts');
    // console.log('data -> ', res);
    if (res) {
        this.articles = res;
        this.articles.forEach(article =>{
          article.time = new Date()
        });
    }
    this.cargando = false;
  }

  async creatArticle() {
    const url = 'https://jsonplaceholder.typicode.com';
    const data: Models.Home.ArticleI = {
      title: 'foo',
      body: 'bar',
      userId: 1,
      
    }
    const res = await this.webService.request<Models.Home.ArticleI>('POST', url, 'posts', data);
    console.log('data post -> ', res);
  }



  ionViewDidEnter() {
    console.log('ionViewDidEnter HomeComponent');
    
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave HomeComponent');

  }

  



}
