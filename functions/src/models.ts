export namespace ModelsFunctions {

    export interface RequestSetRol {
        roles: {
            admin?: boolean
            cliente?: boolean
            motorizado?: boolean
        },
        uid: string
    }

    export interface ResponseSetRol {
        ok: boolean
    }

    export interface UserProfile {
        name: string;
        photo: string;
        age: number;
        id: string;
        email: string;
        roles?: {
            admin?: boolean;
            cliente?: boolean;
            motorizado?: boolean;
        }
    }

    export interface ResponseCreateUser {
        ok: boolean,
        uid?: string;
    }
}
