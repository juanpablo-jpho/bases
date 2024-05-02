import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService: FirestoreService = inject(  FirestoreService);
  storageService: StorageService = inject(StorageService);
  userService: UserService = inject(UserService);
 
  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: ['', Validators.required],
    age: [null, Validators.required],
  });

  cargando: boolean = false;

  progress = '0';
  nameImage: string;


  constructor(private fb: FormBuilder,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {

        this.userService.validateHasProfile = false;
        const res =  await this.authenticationService.createUser(data.email, data.password)
        const blob = await this.storageService.urlToBlob(data.photo);        
        const folder = `PhotosPerfil/${res.user.uid}`;
        const name = this.nameImage
        const snapshot = await this.storageService.uploadFile(folder, name, blob);
        const ulrStorage = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
        data.photo = ulrStorage;
        console.log('ulrStorage -> ', ulrStorage);
        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: data.photo
        };
        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
        // https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png
        // https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg
        await this.authenticationService.updateProfile(profile);
        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age: data.age,
          id: res.user.uid,
          email: data.email,
          roles: { cliente: true}
        }
        console.log('datosUser -> ', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        console.log('usuario creado con éxito');
        this.router.navigate(['/user/perfil'])
      } catch (error) {
        console.log('registrarse error -> ', error);
      }
    }
    this.cargando = false;
  }

  async uploadFile(input: HTMLInputElement) {
    if (input.files.length) {
        const files = input.files;
        console.log('files -> ', files);
        const folder = 'PhotosPerfil'
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)
            if (file) {

              // subir y esperar una promesa
              // const snapshot = await this.storageService.uploadFile(folder, file.name, file)
              // console.log('snapshot -> ', snapshot); 
              // const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
              // console.log('url -> ', url);
              return;

              // subir y ver el progreso
              const s = this.storageService.uploadFileProgress(folder, file.name, file).subscribe( res => {
                  console.log('uploadFileProgress -> ', res);
                  if (res.progress) {
                    this.progress = res.progress.toFixed(2);
                    console.log('this.progress -> ', this.progress);
                    this.changeDetectorRef.detectChanges();
                  }
                  if (res.type == 'complete') {
                    s.unsubscribe();
                  }
              });
    
            }
        }
    }

  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
        const files = input.files;
        const url = this.storageService.fileToUlr(files.item(0));
        this.datosForm.controls.photo.setValue(url);
        this.nameImage = files.item(0).name;


        // const blob = await this.storageService.urlToBlob(url);
        // const folder = `PhotoPerfil/938dhdh37347j`;
        // const name = files.item(0).name;
        // const snapshot = await this.storageService.uploadFile(folder, name, blob);
        // const ulrStorage = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
        // this.datosForm.controls.photo.setValue(ulrStorage);
        // console.log('ulrStorage -> ', ulrStorage);
    }
  }


}
