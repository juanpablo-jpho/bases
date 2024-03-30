import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  httpClient = inject(HttpClient)  

  constructor() { }

  getData(path: string) {
    return new Promise((resolve) => { 
        this.httpClient.get(path).subscribe( data => {
            resolve(data);
            return;
        });
     })    
  }



}
