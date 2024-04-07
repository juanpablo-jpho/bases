
export namespace ModelsHome {

    export interface ArticuloI {
        title: string;
        description: string;
        image: {
            url: string;
            desc: string;
        }
        id?: string;
    }

    export interface ArticleI {
        title: string;
        body: string;
        userId: number;
        id?: number;
        time?: Date;
        name?: string;
        content?: string;
    }
    
    export interface Interface2 {}
    export interface Interface3 {}
    export interface Interface4 {}
    export interface Interface5 {}

}



