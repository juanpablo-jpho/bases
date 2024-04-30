import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private httpClient = inject(HttpClient) 
  token: string;

  constructor() { }

  request<Response>(type: 'POST' | 'GET', url: string, path: string, body: any = {}) {
    return new Promise<Response>((resolve) => { 

      const headers = new HttpHeaders({
        'content-Type': 'application/json',
        'authorization': `Bearer ${this.token}`
      })

      if (type == 'POST') {
          this.httpClient.post<Response>(url + '/' + path, body, {headers}).subscribe( data => {
            resolve(data);
            return;
          });
      }
      if (type == 'GET') {
        this.httpClient.get<Response>(url + '/' + path, {headers}).subscribe( data => {
          resolve(data);
          return;
        });
      }
        
   })    

  }


}
