import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Models } from "src/app/models/models";
import { UserService } from "src/app/services/user.service";

export namespace guards {

  export const isLogin = (path: string = '/home') : CanActivateFn => {
    console.log('isLogin guard -> ', path);
    const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {      
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);

      const login = await userService.isLogin();
      console.log('isLogin -> ', login);
      if (!login) {
          router.navigate([path]);
          return false;
      }
      return true;
    }
    return validador;
  }

  export const notLogin = (path: string = '/home') : CanActivateFn => {
    console.log('notLogin guard');
    const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {      
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);
      const login = await userService.isLogin();
      console.log('Login -> ', login);
      if (login) {
          router.navigate([path ? path: '/']);
          return false;
      }
      return true;
    }
    return validador;
  }

  export const isRol = (roles: Models.Auth.Rol[], path: string = '/home') : CanActivateFn => {
      console.log('isRol -> ', roles);
      const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        let valid = false;
        const userService: UserService = inject(UserService);
        const router: Router = inject(Router);
        const user = await userService.getState();
        if (user) {
            const userProfile = await userService.getUserProfile(user.uid)
            console.log('userProfile -> ', userProfile.roles);
            roles.every( rol => {
              if (userProfile.roles[rol] == true) {
                valid = true;
                return false;
              }
              return true;
            });
        }
        if (!valid) {
            router.navigate([path])
        }
        console.log('valid -> ', valid);
        return valid;
      }
      return validador;
    
  }

  export const isRolClaim = (roles: Models.Auth.Rol[], path: string = '/home') : CanActivateFn => {
    console.log('isRolClaim -> ', roles);
    const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      let valid = false;
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);
      const user = await userService.getState();
      if (user) {
          const tokenResult = await user.getIdTokenResult(true);
          const claims: any = tokenResult.claims;
          if (claims.roles) {
            roles.every( rol => {
              if (claims.roles[rol] == true) {
                valid = true;
                return false;
              }
              return true;
            });

          }
      }
      if (!valid) {
          router.navigate([path])
      }
      console.log('valid -> ', valid);
      return valid;
    }
    return validador;
  
  }




}


