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
    |   UPDATE  |
     ***********/
    update: async (person_id: number, data: {
        first_name?: string
        last_name?: string
        email?: string
        password?: string
        specialty?: string
        medical_notes?: string
    }) => {
        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        } else {
            delete data.password
        }
        return await personModel.update(person_id, data)
    },

    /***********
    |   DELETE  |
     ***********/
    softDelete: async (person_id: number) => {
        return await personModel.softDelete(person_id)
    },

    ban: async (person_id: number, banned: boolean) => {
        return await personModel.ban(person_id, banned)
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (personData: CreatePerson) => {
        /*************************************
        |   BUSCAR QUE EL EMAIL NO EXISTA YA  |
         *************************************/
        const existing = await personModel.getDeleted(personData.email)
        if (existing) {
            // Restore soft-deleted person with updated data
            const hashPassword = personData.password
                ? await bcrypt.hash(personData.password, 10)
                : existing.password ?? ''
            return await personModel.restore(existing.person_id, {
                ...personData,
                password: hashPassword,
            })
        }

        if (await personService.get({ email: personData.email, noPass: true })) {
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

