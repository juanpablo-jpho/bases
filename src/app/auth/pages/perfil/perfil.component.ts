import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { FunctionsService } from 'src/app/firebase/functions.service';
import { StorageService } from 'src/app/firebase/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService:   FirestoreService = inject(  FirestoreService);
  userService: UserService = inject(UserService);
  private functionsService: FunctionsService = inject(FunctionsService);
  storageService: StorageService = inject(StorageService);

  user: User;

  userProfile: Models.Auth.UserProfile;

  newName: string = '';
  newPhoto: string = '';
  newAge: number = null;
  cargando: boolean = false;
  iniciando: boolean = true;

  formNewEmail = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
  });

  enableActualizarEmail: boolean = false;
  enableActualizarPerfil: boolean = false;

  enableCambiarPassword: boolean = false;
  visible: boolean = false;

  isSame = (input: FormControl) => {
    console.log('input -> ', input.value);
    if (this.formCambiarPassword?.value?.newPassword != input?.value) {
        return {notSame: true}
    }  
    return {};
  }

  formCambiarPassword = this.fb.group({
    newPassword: ['', [Validators.required]], // Validators.pattern(Models.Auth.StrongPasswordRegx) 
    repetPassword: ['', [Validators.required, this.isSame]], 
  });

  enableDeletePassword: boolean = false;

  isAdmin: boolean = false;
  newImage: File;


  constructor(private fb: FormBuilder,
              private router: Router) {
                
    this.iniciando = true;
    this.user = this.authenticationService.getCurrentUser()
    this.getDatosProfile(this.user.uid);
    this.getIsAdmin();
    // this.appCall();

  }

  ngOnInit() {}

  async appCall() {
    const response = await this.functionsService.call<any, any>('appCall')
    console.log('response -> ', response);
    
  } 

  ionViewDidEnter() {
    const user = this.authenticationService.getCurrentUser();
    console.log('ionViewDidEnter login -> ', user);
     if (user) {
        this.user = user
     }
  }

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
      // https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg
      await this.authenticationService.updateProfile(data);
      const user = this.authenticationService.getCurrentUser();
      const updateData: any = {
        name: user.displayName,
        photo: user.photoURL
      };
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateData);
      this.user = user;

  }

  async getIsAdmin() {
      this.isAdmin = false;
      const roles = await this.userService.getRol();
      if (roles?.admin) {
        this.isAdmin = true;
      }
  }

  async getDatosProfile(uid: string) {
    console.log('getDatosProfile -> ', uid);
    this.firestoreService.getDocumentChanges<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`).subscribe( res => {
        // this.isAdmin = false
        if (res) {  
          this.userProfile = res;
          console.log('this.userProfile -> ', this.userProfile);
          // if (this.userProfile.roles?.admin == true) {
          //   this.isAdmin = true;
          // }
        }
        this.iniciando = false;
    });
  }

  async actualizarEdad() {
    const user = this.authenticationService.getCurrentUser();
    const updateDoc: any = {
      age: this.userProfile.age,
    }
    await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateDoc)
    console.log('actualizado con éxito');
  }

  async actualizarEmail() {
    if (this.formNewEmail.valid) {
      const data = this.formNewEmail.value;
      console.log('valid -> ', data);
      try {
        await this.authenticationService.verifyBeforeUpdateEmail(data.email);
        await this.authenticationService.logout();
        this.router.navigate(['/user/login']);
        console.log(`te hemos enviado un correo para que puedas verificar tu nuevo correo, 
        verifícalo e inicia sesión con el nuevo correo, 
        caso contrario inicia sesión con tu correo de siempre`);
      } catch (error) {
        console.log('error al actualizar el correo -> ', error);
        console.log('¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?');
     
      }
    }
  }

  async enviarCorreo() {
    await this.authenticationService.sendEmailVerification();
    console.log('correo enviado -> comprueba tu correo',);
  }

  async cambiarPassword() {
    console.log('this.formCambiarPassword -> ', this.formCambiarPassword); 
    if (this.formCambiarPassword.valid) {
      const data = this.formCambiarPassword.value;
      console.log('valid -> ', data);
      try {
        // await this.authenticationService.reauthenticateWithCredential(data.password)
        await this.authenticationService.updatePassword(data.newPassword);
        this.enableCambiarPassword= false;
        console.log('contraseña actualizada con éxito');
      } catch (error) {
        console.log('error al cambiar la contraseña -> ', error);
        console.log('¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?');
      }
    }
  }

  async eliminarCuenta() {
    // preguntar al usuario si está seguro de eliminar la cuenta
      try {
        // const data = this.formDeleteUser.value;
        // await this.authenticationService.reauthenticateWithCredential(data.password)
        const user = this.authenticationService.getCurrentUser();
        // si falla al actualizar la contraseña entonces no podrá eliminar la cuenta
        // debe tener un inicio de sesión reciente
        await this.authenticationService.updatePassword('xxxxxx');
        // primero eliminamos el documento porque en ese momento tenemos permisos
        await this.firestoreService.deleteDocument(`${Models.Auth.PathUsers}/${user.uid}`)
        // luego si eliminamos la cuenta
        await this.authenticationService.deleteUser();
        console.log('cuenta eliminada con éxito');
        await this.authenticationService.logout();
        this.router.navigate(['/user/login'])
      } catch (error) {
        console.log('error al eliminar la cuenta -> ', error);
        console.log('¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?');
      }
  }

  async downloadProfilePicture() {
    await this.storageService.downloadFile(this.userProfile.photo);
    console.log('imagen descargada con éxito');
  }

  async editarProfilePicture() {
    console.log('subiendo...');
    const folder = `PhotosPerfil/${this.user.uid}`;
    const name = this.newImage.name;
    const snapshot = await this.storageService.uploadFile(folder, name, this.newImage)
    // const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
    await this.authenticationService.updateProfile({photoURL: snapshot.ref.fullPath});
    const updateDoc: any = {
      photo: snapshot.ref.fullPath
    }
    await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.uid}`, updateDoc);
    this.user = this.authenticationService.getCurrentUser(); 
    console.log('actualizado con éxito');
    this.newImage = null;
  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
        const files = input.files;
        this.newImage = files.item(0);
    }
  }

}


