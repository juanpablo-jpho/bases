import { Component, Input, OnInit, inject } from '@angular/core';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent  implements OnInit {

  @Input() user: Models.Auth.UserProfile;

  enableAgregarRol: boolean = false;
  rolesUser: {rol: Models.Auth.Rol, enable: boolean}[] = [];
  roles: Models.Auth.Rol[] = ['admin', 'cliente', 'motorizado'];
  private firestoreService = inject(FirestoreService);

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

}
