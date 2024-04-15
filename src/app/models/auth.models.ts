export namespace ModelsAuth {

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

}