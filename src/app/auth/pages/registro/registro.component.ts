import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { UserService } from 'src/app/services/user.service';
import { Browser } from '@capacitor/browser';
import { ListResult } from '@angular/fire/storage';

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
    photo: [null, Validators.required],
    age: [null, Validators.required],
  });

  cargando: boolean = false;

  progress = '0';
  
  file: File;
  image: string = 'PhotosPerfil/rJJyrxNgAubGCpuupTdlmRd1XYZ2/beautiful-latin-woman-avatar-character-icon-free-vector.jpg';
  // image = 'PhotosPerfil/icon-5887113_1280.png'
  video: string;

  fileFirestore: string = 'PhotosPerfil/young-smiling-man-avatar-brown-600nw-2261401207.webp'
  results: ListResult;


  constructor(private fb: FormBuilder,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
              }

  async ngOnInit() {

      //  this.image = await this.storageService.getDownloadURL(this.image);
      const folder = 'PhotosPerfil';
      // const res = await this.storageService.listAll(folder);
      console.log('image -> ', this.image);

      // const metadata = await this.storageService.getMetadata(this.fileFirestore);
      // console.log('metadata -> ', metadata);


      

      
      
  }

  async eliminar() {
    try {
      await this.storageService.deleteFile(this.fileFirestore);
      console.log('eliminado con éxito');
      
    } catch (error) {
      console.log('error al eliminar -> ', error);
      
    }
  }

  async getMoreFiles() {
    console.log('getMoreFiles');
    const folder = 'PhotosPerfil';
    let pageToken = null;
    if (this.results) {
      if (!this.results.nextPageToken) {
        return;
      }
      pageToken = this.results.nextPageToken;
    }
    const res = await this.storageService.list(folder, 1, pageToken);
    if (this.results) {
      res.items.unshift(...this.results.items)
      res.prefixes.unshift(...this.results.prefixes)
    } 
    this.results = res;
    console.log('this.results -> ', this.results);
    
  }

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    // if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {

        const foto: File = data.photo;
        this.userService.validateHasProfile = false;
        const res =  await this.authenticationService.createUser(data.email, data.password)
        const folder = `PhotosPerfil/${res.user.uid}`;
        const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
        const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
        console.log('url -> ', url);
        
        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: snapshot.ref.fullPath
        };
        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
        // https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png
        // https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg
        await this.authenticationService.updateProfile(profile);

        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: snapshot.ref.fullPath,
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
    // }
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
                    console.log('res.url -> ', res.url);
                     
                  }
              });
    
            }
        }
    }

  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
        const files = input.files;
        console.log('viewPreview files -> ', files);
        const img: any = files.item(0)
        this.datosForm.controls.photo.setValue(img);
        console.log('this.datosForm.controls.photo -> ', this.datosForm.controls.photo.value);

    }
  }

  async save() {
    const folder = 'PhotosPerfil/demo';
    // subir y esperar una promesa
    console.log('guardando...');
    const snapshot = await this.storageService.uploadFile(folder, this.file.name, this.file)
    console.log('snapshot -> ', snapshot);     
    const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
    console.log('url -> ', url);
    console.log('guardado con éxito');
  }

  async view(path: string) {
      const url = await this.storageService.getDownloadURL(path);
      Browser.open({url})
  }

  download(path: string) {
    this.storageService.downloadFile(path)
  }




}
