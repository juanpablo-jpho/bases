import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { WebService } from 'src/app/services/web.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard  {
  
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean>  {

      const is = await this.isAdmin();
      return is;
  }

  isAdmin() {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
         resolve(true); 
      }, 2000);
     })
  }

} 

// export const IsAdminGuard: CanActivateFn = async (
//   next: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot) => {

//     console.log('IsAdminGuard -> ', next);
//     console.log('IsAdminGuard -> ', state);
    
    
//     // const webService = inject(WebService);
//     // your  logic goes here
//     // await true;
//     return true;
// }


