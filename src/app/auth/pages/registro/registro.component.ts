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

  constructor(private fb: FormBuilder,
              private router: Router) { }

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

}
