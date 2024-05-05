import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent  implements OnInit {

  firestoreService: FirestoreService = inject(FirestoreService);
  item: Models.Store.Item

  constructor(private route: ActivatedRoute,
              private title: Title,
  ) { 

      this.route.params.subscribe( (params: any) => {
        console.log('params -> ', params);
        
          if (params.enlace) {
            this.loadItem(params.enlace);
          }
      });

  }

  ngOnInit() {}

  async loadItem(enlace: string) {
    const path = 'Products';
    let q: Models.Firebase.whereQuery[] = [['enlace', '==', enlace]];
    let extras: Models.Firebase.extrasQuery = {
      limit: 1,
    }; 
    const res = await this.firestoreService.getDocumentsQuery<Models.Store.Item>(path, q, extras)
    // const res = await this.firestoreService.getDocumentsOneQuery<Models.Store.Item>(path, 'enlace', '==', enlace)
    if (!res.empty) {
      this.item = res.docs[0].data();
      this.title.setTitle(this.item.name);
    }
  }

}
