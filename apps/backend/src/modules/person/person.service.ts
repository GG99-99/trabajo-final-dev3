import bcrypt  from 'bcrypt';
import { personModel } from "./person.model.js"
import { ApiErr, PersonForCreate } from "@final/shared"


export const personService = {
    getPersonByEmail: async (email: string) => {
        return await personModel.getPersonByEmail(email)
    },
    createPerson: async (personData: PersonForCreate) => {
        /*************************************
        |   BUSCAR QUE EL EMAIL NO EXISTA YA  |
         *************************************/
        if( await personService.getPersonByEmail(personData.email)){
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
        const newPerson = await personModel.createPerson(personData)
        return newPerson
    }
}