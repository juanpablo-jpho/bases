import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  form: Models.Auth.DatosLogin;

  authenticationService: AuthenticationService = inject(AuthenticationService);

  user: {email: string, name: string, photo: string};

  newName: string = '';
  cargando: boolean = false;

  constructor() { 
    this.initForm();

    // this.cargando = true;
    this.authenticationService.authState.subscribe( res => {
        console.log('res -> ', res);
        if (res) {
          this.user = {
            email: res.email,
            name: res.displayName,
            photo: res.photoURL
          }
        } else {
          this.user = null
        }
        // this.cargando = false;
    });
          
    
  }

  ngOnInit() {
    
  }

  initForm() {
    this.form = {
      email: '',
      password: ''
    }
  }

  async login() {
    if (this.form?.email && this.form?.password) {
      try {
        await this.authenticationService.login(this.form.email, this.form.password)
      } catch (error) {
          console.log('login error -> ', error);
                
      }
    }
  }

  salir() {
    this.authenticationService.logout();
  }

  async actualizarPerfil() {
    if (this.newName) {
      const data: any = {
        // displayName: this.newName,
        // photoURL: 'https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
        displayName: '',
        photoURL: ''
      }
      await this.authenticationService.updateProfile(data);
      const res = this.authenticationService.getCurrentUser()
      console.log('user -> ', res);
      this.user = {
        email: res.email,
        name: res.displayName,
        photo: res.photoURL
      }
      
    }
  }



}
