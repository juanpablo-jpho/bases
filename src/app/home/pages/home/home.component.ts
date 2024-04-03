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

  private firestoreService = inject(FirestoreService);

  constructor() { }

  async ngOnInit() {
    this.getArticles();
    this.creatArticle();
    const res = await this.firestoreService.getDocument<{name: string}>('/Users/r0VfJPyI1gOE5ithy0rne0HVgn32')
    if (res.exists()) {
      const user = res.data();
      console.log('res -> ', user.name); 
    }

    this.firestoreService.getDocumentChanges<{name: string}>('/Users/r0VfJPyI1gOE5ithy0rne0HVgn32').subscribe( res => {
      const user = res  
      console.log('getDocumentChanges -> ', user.name); 
    });
  }

  async getArticles() {
    this.cargando = true;
    const url = 'https://jsonplaceholder.typicode.com';
    const res = await this.webService.request<Models.Home.ArticleI[]>('GET', url, 'posts');
    console.log('data -> ', res);
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
