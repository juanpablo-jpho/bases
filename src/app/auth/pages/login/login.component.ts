import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  form: Models.Auth.DatosLogin;
  authenticationService: AuthenticationService = inject(AuthenticationService);
  user: User;
  cargando: boolean = false;

  enableLoginWithEmailAndPassword: boolean = false;

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
  });
  enableResetPassword: boolean = false;

  providers: Models.Auth.ProviderLoginI[] = [ 
    {
        name: 'Iniciar sesión con Google',
        id: 'google',
        color: '#20a3df',
        textColor: 'white'
    },
    {
      name: 'Iniciar sesión con Apple',
      id: 'apple',
      color: 'black',
      textColor: 'white'
    },
    {
      name: 'Iniciar sesión con Facebook',
      id: 'facebook',
      color: '#1871ed',
      textColor: 'white'
    },
    {
      name: 'Iniciar sesión con correo y contraseña',
      id: 'password',
      color: '#9e9e9e',
      textColor: 'white'
    }
  ] 

  constructor(private fb: FormBuilder) { 
    this.initForm();

    this.cargando = true;
    this.authenticationService.authState.subscribe( res => {
        if (res) {
          this.user = res
        } else {
          this.user = null
        }
        this.cargando = false;
    });
          
    
  }

  ngOnInit() {
  }

  loginWithProvider(provider: Models.Auth.ProviderLoginI) {
    if (provider.id == 'password') {
      this.enableLoginWithEmailAndPassword = true;
      return;
    }
    this.authenticationService.loginWithProvider(provider.id)
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

  async resetPassword() {
    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {
        await this.authenticationService.sendPasswordResetEmail(data.email)
        this.enableResetPassword = false;
        console.log('te hemos enviado un correo para reestablecer tu contraseña');
      } catch (error) {
        console.log('resetPassword error -> ', error);
      }
    }
  }




}
