export interface TattoWithImg {
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
}
//# sourceMappingURL=tatto.type.d.ts.map