import { Injectable, inject } from '@angular/core';
import { Storage, uploadString, getDownloadURL, ref, uploadBytes, uploadBytesResumable, getBlob } from '@angular/fire/storage';
import { FileSaverService } from 'ngx-filesaver';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage = inject(Storage);

  constructor(private fileSaverService: FileSaverService) {
      const message = 'This is my message.';
      const folder = 'Demo';
      const name = 'text';
      this.uploadString(folder, name, message)
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

  uploadFileProgress(folder: string, name: string, file: File) {
    const storageRef = ref(this.storage, `${folder}/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
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
            type: 'complete',
            error: error.message
          }
          uploadTask$.next(event);
        }, 
        async () => {
          // Handle successful uploads on complete
          const url = await this.getDownloadURL(`${folder}/${name}`);
          const event: ProgressUploadFile = {
            type: 'complete',
            url
          }
          uploadTask$.next(event);
        }
    );
    const uploadTask$ = new Subject<ProgressUploadFile>();
    return uploadTask$.asObservable();
  }

  fileToUlr(file: File) {
    return URL.createObjectURL(file);
  }

  async urlToBlob(url: string) {
    const response = await fetch(url);
    return response.blob();
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

  async downloadFile(url: string) {
    console.log('saveFile');
    const httpsReference = ref(this.storage, url);  
    const blob = await getBlob(httpsReference)

    // dos opciones

    // 1.- creando un elemento <a></a>
    // const urlLocal = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = urlLocal;
    // link.download = httpsReference.name;
    // link.click();
    // link.remove();

    // usando un servio
    this.fileSaverService.save(blob, httpsReference.name);
  }



}

interface ProgressUploadFile {
  type: 'paused' | 'running' | 'complete' | 'error' | string;
  url?: string;
  progress?: number;
  error?: string;
}
