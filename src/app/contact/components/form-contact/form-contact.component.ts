import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent  implements OnInit {

  form: Models.Contact.FormContactI = {
    email: '',
    name: '',
    phone: '000000'
  }

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    name: ['', Validators.required],
    phone: ['', this.isValid], 
  });

  error: string = '';

  cargando: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
      this.datosForm.controls['email'].valueChanges.subscribe( changes => {
        console.log('changes -> ', changes);
      });
      this.loadInfo();
  }

  loadInfo() {
     setTimeout(() => {
        this.datosForm.controls['phone'].setValue('0987654321')
     }, 2000);
  }

  enviar() {
    if (!this.form.email) {
      this.error = 'ingrese su email'
      return;
    }
    this.error = '';
    console.log('enviar -> ', this.form);
  }

  enviarForm() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    if (this.datosForm.valid) {
      console.log('valid');
      const data = this.datosForm.value;
    }
    this.cargando = false;
  }


  isValid(input: FormControl) {
    console.log('input -> ', input.value);
    if (input.value.length != 10) {
      return {mal: true}
    }
    return {};
  }


}
