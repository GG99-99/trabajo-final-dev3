import { ClientCreate, ApiErr, ClientPublic } from "@final/shared";
import { clientModel } from "./client.model.js";
import { personService } from "../person/person.service.js";
import { clienUtils } from "./client.utils.js";
import { ClientWithRelations } from "@final/shared";

export const clientService = {
    get: async (client_id: number) => {
        return await clientModel.get(client_id)
    },
    getByEmail: async (email: string) => {
        const client = await clientModel.getByEmail(email)
        if (!client) return null
        return clienUtils.clientToPublic(client)
    },
    getMany: async () => {
        /******************************
        |   BUSCAR TODOS LOS CLIENTES  |
         ******************************/
        const clients: ClientWithRelations[] = await clientModel.getMany()
        const publicClients: ClientPublic[] = []

        /***************************************************
        |   QUITAR PASSWORD Y RETORNAR COMO UN SOLO OBJETO  |
         ***************************************************/
        if(clients.length === 0) return []
        for(const c of clients) publicClients.push(clienUtils.clientToPublic(c))



        return publicClients

    },
    create: async (data: ClientCreate)=>{
        data.password = ""

        /********************************************
        |   VALIDAR QUE NO EXISTA OTRO CON EL EMAIL  |
         ********************************************/
        const existing = await personService.get({email: data.email, noPass: true})
        if (existing) {
            throw { statusCode: 409, name: "EmailExists", message: "Email already exists" } as ApiErr
        }

        
        return personService.create(data)
    }
}