import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        signOut, authState, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  auth: Auth = inject(Auth);
  authState = authState(this.auth)

  constructor() { 
    // this.logout();
  }

  async createUser(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    return user;
  }

  getCurrentUser() {
      return this.auth.currentUser
  }

  updateProfile(data: {displayName?: string, photoURL?: string}) {
     return updateProfile(this.auth.currentUser, data)
  }


  

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    signOut(this.auth);
  }



}
