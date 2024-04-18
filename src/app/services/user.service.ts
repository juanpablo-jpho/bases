import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from '../firebase/authentication.service';
import { User } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore.service';
import { Models } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private  authenticationService: AuthenticationService = inject(AuthenticationService)
  firestoreService: FirestoreService = inject(  FirestoreService);
  user: User;
  userProfile: Models.Auth.UserProfile;

  constructor(private router: Router) { 

      console.log('UserService init');
      this.authenticationService.authState.subscribe( res => {
        if (res) {
          this.user = res;
          this.getDatosProfile(res.uid);
        } else {
          this.user = null
        }
      });

  }

  async getDatosProfile(uid: string) {
    const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`)
    if (response.exists()) {  
        this.userProfile = response.data();
        if (this.userProfile.email != this.user.email) {
          console.log('sincronizar email');
          const updateData = {email: this.user.email};
          this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${uid}`, updateData)
        }
      } else {
        this.router.navigate(['/user/completar-registro'])
      }
  }




}
