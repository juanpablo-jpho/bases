import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ArticleComponent } from './components/article/article.component';
import { IonContent } from '@ionic/angular/standalone';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from '../shared/pages/not-found/not-found.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { HighlightDirective } from '../shared/directives/highlight.directive';

@NgModule({
  declarations: [
    HomeComponent,
    ArticleComponent,
    ArticlePageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IonContent,
    SharedModule,
    NotFoundComponent,
    HighlightDirective
  ]
})
export class HomeModule { }
