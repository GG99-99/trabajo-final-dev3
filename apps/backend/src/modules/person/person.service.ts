import { personModel } from "./person.model.js"

export const personService = {
    getPersonByEmail: async (email: string) => {
        return await personModel.getPersonByEmail(email)
    }
}