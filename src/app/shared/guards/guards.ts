import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Models } from "src/app/models/models";
import { UserService } from "src/app/services/user.service";

export namespace guards {

  export const isLogin = (path: string = null) : CanActivateFn => {
    console.log('isLogin guard');
    const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {      
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);
      const login = await userService.isLogin();
      console.log('isLogin -> ', login);
      if (!login) {
          router.navigate([path ? path: '/']);
          return false;
      }
      return true;
    }
    return validador;
  }

  export const notLogin = (path: string = null) : CanActivateFn => {
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

  export const isRol = (roles: Models.Auth.Rol[], path: string = null) : CanActivateFn => {
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
            router.navigate([path ? path: '/'])
        }
        console.log('valid -> ', valid);
        return valid;
      }

      return validador;
    
  }
  
  export const simpleConArgumentos = (params: any): CanActivateFn => {
        console.log('simpleConArgumentos params -> ', params);
        const validador = (route: any, state: any) => {
            console.log('route -> ', route);
            console.log('state -> ', state);
            return true
        } 
        return validador
  } 

}


// export const simple: CanActivateFn = () => { return true }   

// export const simple: CanActivateFn = () => {
//     console.log('simple guard');
//     return true
// } 

// export const simple: CanActivateFn = (route: any, state: any) => {
//     console.log('simple guard');
//     console.log('route -> ', route);
//     console.log('state -> ', state);
//     return true
// } 

export const simple: CanActivateFn = (route: any, state: any) => {
        console.log('simple guard');
        console.log('route -> ', route);
        console.log('state -> ', state);
        return true
} 

// export const simpleConArgumentos = () => {
//     console.log('simpleConArgumentos');
//     return simple;
// }

// export const simpleConArgumentos = (params: any) => {
//     console.log('simpleConArgumentos params -> ', params);
//     return simple;
// }


// export const simpleConArgumentos = (params: any): CanActivateFn => {
//     console.log('simpleConArgumentos params -> ', params);
//     const validador = (route: any, state: any) => {
//       console.log('validador');
//       console.log('route -> ', route);
//       console.log('state -> ', state);
//       return true
//     } 
//     return validador
// } 


export const simpleConArgumentos = (params: any): CanActivateFn => {
    // recibimos parametros adicionales
    const validador = (route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => { 
        // aqui va la lógica
        // podemos añadir servicios con inject
        return true
    };
    return validador
}
