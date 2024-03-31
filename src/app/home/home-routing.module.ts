import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { IsAdminGuard } from '../shared/guards/is-admin.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, },
  {path: 'article', component: ArticlePageComponent, canActivate: [IsAdminGuard]},

  // {path: 'article/:id', component: ArticlePageComponent},
  
  // {path: 'article/:id', component: ArticlePageComponent},
  // {path: 'article/:id/:a/:b', component: ArticlePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
