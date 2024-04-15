import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
 
  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required],
    // name: ['', Validators.required],
    // photo: ['', Validators.required],
    // edad: [null, Validators.required],
  });
  cargando: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {
        const user =  await this.authenticationService.createUser(data.email, data.password)
        console.log('user -> ', user);
      } catch (error) {
        console.log('registrarse error -> ', error);
        
      }
    }
    this.cargando = false;
  }

}
