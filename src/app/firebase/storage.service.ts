import { Injectable, inject } from '@angular/core';
import { Storage, uploadString, getDownloadURL, ref, uploadBytes, 
          uploadBytesResumable, getBlob, listAll, 
          list, getMetadata, deleteObject} from '@angular/fire/storage';
import { FileSaverService } from 'ngx-filesaver';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage = inject(Storage);

  constructor(private fileSaverService: FileSaverService) {

    const ref = 'PhotosPerfil/icon-5887113_1280.png';
    const url = 'https://firebasestorage.googleapis.com/v0/b/otra-app-645d0.appspot.com/o/PhotosPerfil%2Ficon-5887113_1280.png?alt=media&token=8012ecdc-3e02-4952-b514-47981d9366ab'

  }

  uploadString(folder: string, name: string, text: string) {
      const storageRef = ref(this.storage, `${folder}/${name}`);
      uploadString(storageRef, text).then((snapshot) => {
        console.log('Uploaded string! -> ', snapshot);
      });
  }

  async uploadFile(folder: string, name: string, file: File | Blob) {
    const storageRef = ref(this.storage, `${folder}/${name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot;
  }

  getDownloadURL(path: string) {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef)
  }

  uploadFileProgress(folder: string, name: string, file: File | Blob) {
    const storageRef = ref(this.storage, `${folder}/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadTask.on()
    const uploadTask$ = new Subject<ProgressUploadFile>();
    uploadTask.on('state_changed', 
        (snapshot) => {

          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          const event: ProgressUploadFile = {
            type: snapshot.state,
            progress
          }
          uploadTask$.next(event);
        }, 
        (error) => {
          // Handle unsuccessful uploads
          const event: ProgressUploadFile = {
            type: 'error',
            error: error.message
          }
          uploadTask$.next(event);
        }, 
        async () => {
          // Handle successful uploads on complete
          const url = await this.getDownloadURL(storageRef.fullPath);
          const event: ProgressUploadFile = {
            type: 'complete',
            url,
            ref: storageRef.fullPath
          }
          uploadTask$.next(event);
        }
    );
    return uploadTask$.asObservable();
  }

  listAll(path: string) {
    const storageRef = ref(this.storage, path);
    return listAll(storageRef)
  }

  list(path: string, maxResults: number = 100, pageToken: any = null) {
    const storageRef = ref(this.storage, path);
    const opts: any = {maxResults};
    if (pageToken) {
      opts.pageToken = pageToken
    }
    return list(storageRef, opts)
  }

  fileToUlr(file: File) {
    return URL.createObjectURL(file);
  }

  fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
     })
  };

  getMetadata(path: string) {
    const storageRef = ref(this.storage, path);
    return getMetadata(storageRef)
  }



  async urlToBlob(url: string) {
    const response = await fetch(url);
    return response.blob();
  }

  async downloadFile(path: string) {
    console.log('saveFile');
    const storageRef = ref(this.storage, path);  
    const blob = await getBlob(storageRef)
    console.log('blob -> ', blob);
    
    // dos opciones

    // 1.- creando un elemento <a></a>
    // const urlLocal = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = urlLocal;
    // link.download = storageRef.name;
    // link.click();
    // link.remove();

    // usando un servio
    this.fileSaverService.save(blob, storageRef.name);
  }


  deleteFile(path: string) {
    const storageRef = ref(this.storage, path); 
    return deleteObject(storageRef)
  }



}

interface ProgressUploadFile {
  type: string;
  url?: string;
  ref?: string;
  progress?: number;
  error?: string;
}
