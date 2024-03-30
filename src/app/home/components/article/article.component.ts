import { Component, Input, OnInit } from '@angular/core';
import { Models } from 'src/app/models/models';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {
  
  @Input() article: Models.Home.ArticleI;
  
  constructor() {}

  ngOnInit() {
  }



}
