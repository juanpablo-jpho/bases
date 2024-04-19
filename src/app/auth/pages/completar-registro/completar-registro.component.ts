

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.component.html',
  styleUrls: ['./completar-registro.component.scss'],
})
export class CompletarRegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService:   FirestoreService = inject(  FirestoreService);
 
  cargando: boolean = false;
  iniciando: boolean = true;

  user: User;
  userProfile: Models.Auth.UserProfile;

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
                        this.user = res
                        this.datosFormCompleteRegistro.setValue({
                            email: res.email,
                            name: res.displayName,
                            photo: res.photoURL,
                            age: null
                        })
                      }
                      this.iniciando = false;
                      
                  });

  }

  ngOnInit() {}

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
          email: data.email,
          roles: { cliente: true }
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
