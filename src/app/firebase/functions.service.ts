import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable, connectFunctionsEmulator } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  private functions: Functions = inject(Functions);

  constructor() {
    // connectFunctionsEmulator(this.functions, '127.0.0.1', 5001)
  }

  call<request, response>(name: string, data: request = null) {
    const ws = httpsCallable<request, response>(this.functions, name);
    return ws(data)
  }


}