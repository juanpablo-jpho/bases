import { Component, OnInit } from '@angular/core';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {

  article: Models.Home.ArticuloI;
  

  constructor() { 
      this.loadArticulo();
  }

  ngOnInit() {}

  loadArticulo() {
      const data = {
        title: 'Angular aplications',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo minus aut repellendus id aspernatur? Officiis voluptas velit ex impedit deleniti obcaecati magnam atque, rem, voluptatum enim minima harum, corrupti assumenda.',
        image: {
          url: '/assets/images/angular-logo.png',
          desc: 'logo de angular'
        },
      }
      this.article = data;
  }

}


