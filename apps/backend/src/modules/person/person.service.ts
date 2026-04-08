import bcrypt  from 'bcrypt';
import { personModel } from "./person.model.js"
import { ApiErr,  PersonForCreate } from "@final/shared"
import { PersonFilters } from './person.interface.js';


export const personService = {
    /*********
    |   READ  |
     *********/
    get: async (filters: PersonFilters) => {
        return await personModel.get({person_id: filters.person_id, email: filters.email, noPass: filters.noPass})
    },
    

    /***********
    |   CREATE  |
     ***********/
    create: async (personData: PersonForCreate) => {
        /*************************************
        |   BUSCAR QUE EL EMAIL NO EXISTA YA  |
         *************************************/
        if( await personService.get({email: personData.email, noPass: true})){
            throw({
                statusCode: 409, 
                name: "EmailAlreadyExist", 
                message: "El correo electronico ya se encuetra en uso"
            } as ApiErr)
        }

        /******************
        |   HASHEAR CLAVE  |
         ******************/
        const hashPassword = await bcrypt.hash(personData.password, 10)
        personData.password = hashPassword
        
        

        
        /******************
        |   CREAR PERSONA  |
         ******************/
        const newPerson = await personModel.create(personData)
        return newPerson
    }
}