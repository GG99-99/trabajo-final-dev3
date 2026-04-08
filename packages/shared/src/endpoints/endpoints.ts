

/*********
|   AUTH  |
 *********/
const AUTH = '/auth'
export const AUTH_ENDPOINTS = {
    LOGIN: AUTH + '/login',
    REGISTER: AUTH + '/register'
}

fetch(AUTH_ENDPOINTS.LOGIN)


/***********
|   TATTOO  |
 ***********/
const TATTO = '/tattooo'
const CUSTOMIZE = TATTO + '/customize'
export const TATTO_ENDPOINTS = {
    GETALL: TATTO,


    CUSTOMIZE: {
        GETALL: CUSTOMIZE,
        CREATE: CUSTOMIZE + '/create', // post
        // '/customize/:customize_tattooo_id'
        
    }

}