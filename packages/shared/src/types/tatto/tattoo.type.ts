import  prisma from "@final/db";
import type  {Prisma} from "@final/db"
import type { CreateImg } from "../index.types.js";



/*****************
|   READ METHODS  |
 *****************/
export type GetTattoo = {
    tattoo_id: number;
}

export type GetTattooMaterials = {
    tattoo_id: number;
}

/***********
|   CREATE  |
 ***********/
export type CreateTattoo = {
    name: string;
    cost: number;
    time: Date;
    img_id: number;
}

export type CreateTattooRequest = {
    name: string;
    cost: number;
    time: Date;
    img: CreateImg;
    materials: {
        product_variant_id: number,
        quantity: number,
    }[];
    
}



/***********
|   OBJECT  |
 ***********/
export type TattoWithImg = Prisma.Result<
    typeof prisma.tattoo,
    {
        include: {
            img: true
        }
    },
    'findUnique'
>

export type TattoWithMaterials = Prisma.Result<
    typeof prisma.tattoo,
    {
        include: {
            materials: true
        }
    },
    'findUnique'
>

export type CreateTattooMaterial = {
    tattoo_id: number;
    product_variant_id: number;
    quantity: number;
}