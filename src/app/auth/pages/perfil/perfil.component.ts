import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService:   FirestoreService = inject(  FirestoreService);

  user: {email: string, name: string, photo: string};

  userProfile: Models.Auth.UserProfile;

  newName: string = '';
  newPhoto: string = '';
  newAge: number = null;
  cargando: boolean = false;

  constructor() { 
    this.cargando = true;
    this.authenticationService.authState.subscribe( res => {
        console.log('res -> ', res);
        if (res) {
          this.user = {
            email: res.email,
            name: res.displayName,
            photo: res.photoURL
          }
          this.getDatosProfile(res.uid);
        } else {
          this.user = null
          this.cargando = false;
        }
    });
          
    
  }

  ngOnInit() {}

  salir() {
    this.authenticationService.logout();
  }

  async actualizarPerfil() {
      let data: Models.Auth.UpdateProfileI = {};
      
      if (this.newName) {
        data.displayName = this.newName;
      }
      if (this.newPhoto) {
        data.photoURL = this.newPhoto;
      }
      // data = { displayName: '', photoURL: ''}
      // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
      // https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png
      await this.authenticationService.updateProfile(data);
      const user = this.authenticationService.getCurrentUser();
      const updateData: any = {
        name: user.displayName,
        photo: user.photoURL
      };
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateData);
      this.user = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL 
      }

  }

  getDatosProfile(uid: string) {
    console.log('getDatosProfile -> ', uid);
    this.firestoreService.getDocumentChanges<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`).subscribe( res => {
        if (res) {  
          this.userProfile = res;
          console.log('this.userProfile -> ', this.userProfile);
        }
        this.cargando = false;
    });
  }

  async actualizarEdad() {
    const user = this.authenticationService.getCurrentUser();
    const updateDoc: any = {
      age: this.userProfile.age
    }
    await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateDoc)
    console.log('actualizado con éxito');
    
  }

  

}
