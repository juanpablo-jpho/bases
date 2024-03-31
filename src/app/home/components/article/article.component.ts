import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from 'src/app/models/models';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {
  
  @Input() article: Models.Home.ArticleI;
  // private router = inject(Router)
  
  constructor(private router: Router) {
    // console.log('constructor ArticleComponent');
  }

  ngOnInit() {
    // console.log('ngOnInit ArticleComponent');
  }

  ngOnDestroy() {
    // console.log('ngOnDestroy ArticleComponent');
  }

  ngOnChanges() {
      // console.log('ngOnChanges ArticleComponent');
  }

  gotoArticle() {
    // this.router.navigate([`/home/article/${this.article.id}`])

    this.router.navigate([`/home/article`], { queryParams: {id: this.article.id, b: 'hola mundo'} });

    // this.router.navigate([`/home/article/${this.article.id}` ]);
    // this.router.navigate([`/home/article/${this.article.id}/a/b` ]);
  }



}
