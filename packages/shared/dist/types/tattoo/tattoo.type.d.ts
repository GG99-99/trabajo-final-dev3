export type TattoWithImg = {
    tattoo_id: number;
    img_id: number;
    cost: number;
    time: Date;
    name: string;
    img: {
        img_id: number;
        source: Uint8Array<ArrayBuffer>;
        description: string | null;
    };
};
/*****************
|   READ METHODS  |
 *****************/
export type GetTattoo = {
    tattoo_id: number;
};
export type GetTattooMaterials = {
    tattoo_id: number;
};
//# sourceMappingURL=tattoo.type.d.ts.map