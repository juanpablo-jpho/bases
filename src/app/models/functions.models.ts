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

}
