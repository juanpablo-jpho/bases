import { Component, Input, OnInit, inject } from '@angular/core';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { WebService } from 'src/app/services/web.service';
import { FunctionsService } from 'src/app/firebase/functions.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent  implements OnInit {

  @Input() user: Models.Auth.UserProfile;

  private webService: WebService = inject(WebService);
  private firestoreService = inject(FirestoreService);
  private functionsService: FunctionsService = inject(FunctionsService);

  enableAgregarRol: boolean = false;
  rolesUser: {rol: Models.Auth.Rol, enable: boolean}[] = [];
  roles: Models.Auth.Rol[] = ['admin', 'cliente', 'motorizado'];

  constructor() { }

  ngOnInit() {
      this.initRoles()
  }

  initRoles() {
    this.roles.forEach( rol => {
      this.rolesUser.push({rol, enable: this.user.roles[rol]})
    });
  }

  selectRol(rol: Models.Auth.Rol) {
    const item = this.rolesUser.find( item => { return item.rol == rol});
    if (item) {
      item.enable = !item.enable
    }
  }

  async actualizarRol() {
    console.log('actualizarRol -> ', this.rolesUser);
    const roles: any = {};
    this.rolesUser.forEach( item => {
       if (item.enable) {
          roles[item.rol] = true 
       }
    });
    const updateDoc = { 
      roles
    }
    console.log('updateDoc -> ', updateDoc);
    try {
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.id}`, updateDoc);
      console.log('actualizado roles con éxito');
      this.enableAgregarRol = false;
    } catch (error) {
      console.log('permisos insuficientes -> ', error);
    }
  }

  async setRol() {
    const url = 'http://127.0.0.1:5001/basesfire/us-central1';
    const request: Models.Functions.RequestSetRol = {
      roles: {
        cliente: true
      },
      uid: this.user.id
    }
    const res = await this.webService.request<Models.Functions.ResponseSetRol>('POST', url, 'setRol', request)
    if (res.ok) {
      console.log('actualizado rol con éxito');
    }
  }

  async setClaim() {
      const roles: any = {};
      this.rolesUser.forEach( item => {
         if (item.enable) {
            roles[item.rol] = true 
         }
      });
      const updateDoc = { 
        roles
      }
      console.log('updateDoc -> ', updateDoc);
      const request: Models.Functions.RequestSetRol = {
        roles,
        uid: this.user.id
      }
      const response = await this.functionsService.call<any, any>('appCall', request)

      console.log('response -> ', response);
  }

  async helloWorld() {
    const url = 'http://127.0.0.1:5001/basesfire/us-central1';
    const res = await this.webService.request<any>('POST', url, 'helloWorld')
    console.log('helloWorld -> ', res);

  }

}
