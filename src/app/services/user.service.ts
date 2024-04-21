import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from '../firebase/authentication.service';
import { User } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore.service';
import { Models } from '../models/models';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private  authenticationService: AuthenticationService = inject(AuthenticationService)
  private firestoreService: FirestoreService = inject(  FirestoreService);
  private user: User;
  private userProfile: Models.Auth.UserProfile;
  private login: 'login' | 'not-login';


  constructor(private router: Router,
              private route: ActivatedRoute) { 

      console.log('UserService init');
      this.getState();

  }

  getState() {
      return new Promise<User>((resolve) => {
          if (this.login) {
            resolve(this.user);
            return;
          }
          this.authenticationService.authState.subscribe( res => {
            if (res) {
              this.user = res;
              this.login = 'login';
              this.getUserProfile(res.uid);
            } else {
              this.user = null
              this.login = 'not-login';
            }
            resolve(this.user);
          });
      })
  }

  async getUserProfile(uid: string) {
    return new Promise<Models.Auth.UserProfile>( async (resolve) => {

        const queryParams: any = this.route.snapshot.queryParams;
        const intentId = queryParams.intentId
        if (intentId) { 
          resolve(null)
          return; 
        }

        const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`)
        if (response.exists()) {  
            this.userProfile = response.data();
            resolve(this.userProfile);
            if (this.userProfile.email != this.user.email) {
              console.log('sincronizar email');
              const updateData = {email: this.user.email};
              this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${uid}`, updateData)
            }
        } else {
          this.router.navigate(['/user/completar-registro'])
        }
    });
  }

  isLogin() {
    return new Promise<boolean>( async (resolve) => {
      const user = await this.getState();
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }




}
