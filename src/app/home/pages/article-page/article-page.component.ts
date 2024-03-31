import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Models } from 'src/app/models/models';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent  implements OnInit {

  private webService = inject(WebService);
  private route = inject(ActivatedRoute)
  article: Models.Home.ArticleI;

  constructor(
    // private route: ActivatedRoute
    ) { 

    this.route.params.subscribe( (params: any) => {
      console.log('params en article -> ', params);
      if (params.id) {
        this.loadArticle(params.id);
      }
    })

    this.route.queryParams.subscribe( (queryParams: any) => {
      console.log('queryParams -> ', queryParams);
      if (queryParams.id) {
        this.loadArticle(queryParams.id)
      }
    });

  }

  ngOnInit() {}

  async loadArticle(id: string) {
    const url = 'https://jsonplaceholder.typicode.com';
    const path = 'posts/' + id;
    const res = await this.webService.request<Models.Home.ArticleI>('GET', url, path);
    if(res) {
      this.article = res;
      console.log('this.article -> ', this.article);
    }
  }

}
