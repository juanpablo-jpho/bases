
export namespace ModelsStore {

    export interface Item {
        id?: string;
        date?: Date;
        name: string;
        description: string;
        price: number;
        image?: string;
        stock: number;
        enable: boolean;
        categories: string[];
        salty?: boolean;
        enlace?: string
    }
    export interface Pedido {
        
    }
    export interface Carrito {
        total: number;
        cantidadTotal: number;
        items: {
            item: Item;
            cant: number;
        }[]
    }
}


    