

/****************
|   POST METHOD  |
 ****************/
// el tipo  de la data que se debe enviar al backend para hacer el login
export type LoginData = {
    email: string;
    password: string;
}


export type RegisterToken = {
    expiresAt: number;
}

/*****************
|   API RESPONSE  |
 *****************/

export interface ApiErr {
     message: string;
     name: string;
     statusCode: number;
}
// tipo de respuesta generica del backend
export type ApiResponse<T> =
  | { ok: true;  data: T;    error: null }
  | { ok: false; data: null; error: ApiErr }