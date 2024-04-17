import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  formNewEmail = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required]], 
  });

  enableActualizarEmail: boolean = false;
  correoVerificado: boolean = false;

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
    password: ['', [Validators.required]], 
    newPassword: ['', [Validators.required]], // Validators.pattern(Models.Auth.StrongPasswordRegx) 
    repetPassword: ['', [Validators.required, this.isSame]], 
  });


  formDeleteUser = this.fb.group({
    password: ['', [Validators.required]], 
  });
  enableDeletePassword: boolean = false;




  constructor(private fb: FormBuilder,
              private router: Router) { 
    this.cargando = true;
    this.authenticationService.authState.subscribe( res => {
        console.log('res -> ', res);
        if (res) {
          this.user = {
            email: res.email,
            name: res.displayName,
            photo: res.photoURL
          }
          this.correoVerificado = res.emailVerified
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
      // https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg
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

  async actualizarEmail() {
    if (this.formNewEmail.valid) {
      const data = this.formNewEmail.value;
      console.log('valid -> ', data);
      try {
        await this.authenticationService.reauthenticateWithCredential(data.password)
        // await this.authenticationService.verifyBeforeUpdateEmail(data.email);
        // await this.authenticationService.logout();
        // this.router.navigate(['/user/login']);
        // return

        // await this.authenticationService.login(user.email, data.password)
        await this.authenticationService.updateEmail(data.email);
        const updateDoc: any = {
          email: data.email
        }
        let user = this.authenticationService.getCurrentUser();
        await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateDoc);
        this.enableActualizarEmail = false;
        this.user.email = user.email;
        console.log('actualizado correo con éxito');
      } catch (error) {
        console.log('error al actualizar el correo -> ', error);
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
        await this.authenticationService.reauthenticateWithCredential(data.password)
        await this.authenticationService.updatePassword(data.newPassword);
        this.enableCambiarPassword= false;
        console.log('contraseña actualizada con éxito');
      } catch (error) {
        console.log('error al cambiar la contraseña -> ', error);
      }
    }
  }

  isEqual(input: FormControl) {
    console.log('input -> ', input.value);
    console.log('enableCambiarPassword -> ', this.enableCambiarPassword);
    
    if (this.formCambiarPassword?.value?.newPassword != input?.value) {
        return {notSame: true}
    }  
    return {notSame: false};
  }

  async eliminarCuenta() {
    // preguntar al usuario si está seguro de eliminar la cuenta
    if (this.formDeleteUser.valid) {
      try {
        const data = this.formDeleteUser.value;
        await this.authenticationService.reauthenticateWithCredential(data.password)
        const user = this.authenticationService.getCurrentUser();
        await this.firestoreService.deleteDocument(`${Models.Auth.PathUsers}/${user.uid}`)
        await this.authenticationService.deleteUser();
        
        console.log('cuenta eliminada con éxito');
        await this.authenticationService.logout();
        this.router.navigate(['/user/login'])
      } catch (error) {
        console.log('error al eliminar la cuenta -> ', error);
  
      }
    }
    
  }



  

}


