import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        signOut, authState, updateProfile, updateEmail,
        sendEmailVerification,
      reauthenticateWithCredential, 
      EmailAuthProvider, verifyBeforeUpdateEmail,
      updatePassword
    } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  auth: Auth = inject(Auth);
  authState = authState(this.auth)

  constructor() { 
    // this.logout();
    this.auth.languageCode = 'es';
  }

  async createUser(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.sendEmailVerification();
    return user;
  }

  getCurrentUser() {
      return this.auth.currentUser
  }

  updateProfile(data: {displayName?: string, photoURL?: string}) {
     return updateProfile(this.auth.currentUser, data)
  }

  updateEmail(email: string) {
    return updateEmail(this.auth.currentUser, email)
  }

  verifyBeforeUpdateEmail(email: string) {
    return verifyBeforeUpdateEmail(this.auth.currentUser, email)
  }

  reauthenticateWithCredential(password: string) {
    const credential = EmailAuthProvider.credential(
      this.auth.currentUser.email,
      password
    );
    return reauthenticateWithCredential(this.auth.currentUser, credential)
  }

  sendEmailVerification() {
    return sendEmailVerification(this.auth.currentUser)
  }

  updatePassword(newPasword: string) {
    return updatePassword(this.auth.currentUser, newPasword)
  }


  

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }



}
