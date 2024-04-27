import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent  implements OnInit {

  private firestoreService = inject(FirestoreService);

  roles: Models.Auth.Rol[] = ['admin', 'cliente', 'motorizado'];
  rolSelected: Models.Auth.Rol = 'admin';  
  users: Models.Auth.UserProfile[];
  cargando: boolean = true;
  enableMore: boolean = false;

  enableBuscarPorEmail: boolean = false;
  formEmail = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
  });

  constructor(private fb: FormBuilder) {
        this.getMoreUsers();
  }

  ngOnInit() {}

  async getMoreUsers(rol: Models.Auth.Rol = this.rolSelected) {
    
      if (this.rolSelected != rol) {
        this.users = null;
        this.cargando = true;
        this.enableMore = true
      }

      this.rolSelected = rol;
      console.log('getMoreUsers');
      const path = Models.Auth.PathUsers;
      const numItems = 1;
      let q: Models.Firebase.whereQuery[];
      q = [ [`roles.${rol}`, '==', true] ];
      const extras: Models.Firebase.extrasQuery = {
        orderParam: 'date', 
        directionSort: 'desc', 
        limit: numItems,
      }
  
      if (this.users) {
        const last = this.users[ this.users.length - 1 ];
        const snapDoc = await this.firestoreService.getDocument(`${path}/${last.id}`)
        extras.startAfter = snapDoc
      }
  
      const res = await this.firestoreService.getDocumentsQuery<Models.Auth.UserProfile>(path, q, extras)
      this.cargando = false;
      console.log('res -> ', res);
      if (res.size) {
        if (res.size < numItems) {
          this.enableMore = false
        }    
        if (!this.users) {
          this.users = []
        } 
        res.forEach( item => {
          this.users.push(item.data());
        });
      } else {
        this.enableMore = false
      }

      
    

  }

  async buscarPorEmail() {
      if( this.formEmail.valid) {
        const data = this.formEmail.value;
        this.users = null;
        this.cargando = true;
        this.enableMore = false;
        const path = Models.Auth.PathUsers;
        let q: Models.Firebase.whereQuery[];
        q = [ [`email`, '==', data.email] ];
        const response = await this.firestoreService.getDocumentsQuery<Models.Auth.UserProfile>(path, q);
        this.cargando = false;
        if (!response.empty) {
          response.forEach((item) => {
              this.users = [];
              this.users.push(item.data());
          });
        }


      }
  }

}
