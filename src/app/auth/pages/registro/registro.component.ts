import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService:   FirestoreService = inject(  FirestoreService);
 
  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: ['', Validators.required],
    age: [null, Validators.required],
  });
  cargando: boolean = false;
  iniciando: boolean = true;

  user: {email: string, name: string, photo: string};
  userProfile: Models.Auth.UserProfile;
  completeRegistro: boolean = false;

  datosFormCompleteRegistro = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    name: ['', Validators.required],
    photo: ['', Validators.required],
    age: [null, Validators.required],
  });
  

  constructor(private fb: FormBuilder,
              private router: Router) { 

                  this.authenticationService.authState.subscribe( res => {
                      if (res) {
                        this.user = {
                          email: res.email,
                          name: res.displayName,
                          photo: res.photoURL
                        }
                        this.datosFormCompleteRegistro.setValue({
                            email: res.email,
                            name: res.displayName,
                            photo: res.photoURL,
                            age: null
                        })
                        this.getDatosProfile(res.uid);
                      } else {
                        this.iniciando = false;
                      }
                      
                  });

              }

  ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {
        const res =  await this.authenticationService.createUser(data.email, data.password)
        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: data.photo
        };
        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg
        await this.authenticationService.updateProfile(profile);
        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age: data.age,
          id: res.user.uid,
          email: data.email
        }
        console.log('datosUser -> ', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        console.log('usuario creado con éxito');
        this.router.navigate(['/user/login'])
      } catch (error) {
        console.log('registrarse error -> ', error);
      }
    }
    this.cargando = false;
  }

  async getDatosProfile(uid: string) {
    console.log('getDatosProfile -> ', uid);
    const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`)
    console.log('getDatosProfile -> ', response.exists());
    
    if (response.exists()) {  
        this.userProfile = response.data();
        console.log('this.userProfile -> ', this.userProfile);
        this.router.navigate(['/user/perfil'])
    } else {
        this.completeRegistro = true;
    } 
    this.iniciando = false;
    
  }

  async completarRegistro() {
    this.cargando = true;
    console.log('datosFormCompleteRegistro -> ', this.datosFormCompleteRegistro);
    if (this.datosFormCompleteRegistro.valid) {
      const data = this.datosFormCompleteRegistro.value;
      console.log('valid -> ', data);
      try {
        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: data.photo
        };
        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg
        const user = this.authenticationService.getCurrentUser()
        await this.authenticationService.updateProfile(profile);
        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age: data.age,
          id: user.uid,
          email: data.email
        }
        console.log('datosUser -> ', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, user.uid);
        console.log('completado registro con éxito');
        this.router.navigate(['/user/perfil'])
      } catch (error) {
        console.log('registrarse error -> ', error);
      }
    }
    this.cargando = false;
  }

}
