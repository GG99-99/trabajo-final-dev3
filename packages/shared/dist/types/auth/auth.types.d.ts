/********************
|   BODY OF REQUEST  |
 ********************/
export type LoginData = {
    email: string;
    password: string;
};
/*****************
|   API RESPONSE  |
 *****************/
export interface ApiErr {
    message: string;
    name: string;
    statusCode: number;
}
export type ApiResponse<T> = {
    ok: true;
    data: T;
    error: null;
} | {
    ok: false;
    data: null;
    error: ApiErr;
};
//# sourceMappingURL=auth.types.d.ts.map