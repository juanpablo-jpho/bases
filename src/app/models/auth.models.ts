export namespace ModelsAuth {

    export const PathUsers = 'Users'
    export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

    export interface DatosResgister {
        email: string;
        password: string;
    }

    export interface DatosLogin {
        email: string;
        password: string;
    }

    export interface UpdateProfileI {
        displayName?: string, 
        photoURL?: string
    }

    export interface UserProfile {
        name: string;
        photo: string;
        age: string;
        id: string;
        email: string;
    }

}