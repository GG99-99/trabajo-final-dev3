import bcrypt  from 'bcrypt';
import { personModel } from "./person.model.js"
import { ApiErr, CreatePerson, GetPerson } from "@final/shared"


export const personService = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetPerson) => {
        return await personModel.get({person_id: filters.person_id, email: filters.email, noPass: filters.noPass})
    },

    getMany: async () => {
        return await personModel.getMany()
    },
    

    /***********
    |   CREATE  |
     ***********/
    create: async (personData: CreatePerson) => {
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

